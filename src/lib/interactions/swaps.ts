import { NotEnoughLiquidityError, SwapError } from '$lib/errors';
import { mapPair } from '$lib/mappers';
import type { Order, Pair, PairResponse } from '$lib/types';
import { type Amount, type BufferId } from '@chromia/ft4';
import { formatter, type Queryable } from 'postchain-client';
import { getCcy, sequentialize } from './utils';
import { getAllOrdersByPriceRange } from './queries';

export const PRICE_PRECISION: bigint = 2n ** 256n - 1n;
const SWAP_PERTHOU: bigint = 3n;
const ORDER_PERTHOU: bigint = 3n;

function sqrt(x: bigint) {
	if (x < 0) throw "Can't compute the square root of a negative number";
	let L = 0n;
	let M: bigint;
	let R = x + 1n;

	while (L != R - 1n) {
		M = (L + R) / 2n;
		if (M * M <= x) {
			L = M;
		} else {
			R = M;
		}
	}

	return L;
}

export function calcImpact(
    pair1: Pair | undefined,
    pair2: Pair | undefined,
    amountIn: bigint,
    amountOut: bigint,
    buyCcy: boolean
) {
    if (pair1 === undefined) return 0
    if (pair2 === undefined) {
        const liqIn = buyCcy? pair1.amount1 : pair1.amountCcy;
        const liqOut = buyCcy? pair1.amountCcy : pair1.amount1;
        
        const actualPrice = calcPrice(amountIn, amountOut);
        const expectedPrice = calcPrice(liqIn, liqOut);
        
        return 100 - Number(100000n * expectedPrice / actualPrice)/1000
    } else {
        const p1 = calcPrice(pair1.amount1, pair1.amountCcy)
        const p2 = calcPrice(pair2.amountCcy, pair2.amount1)

        const expectedPrice = p1 * p2 / PRICE_PRECISION;
        const actualPrice = calcPrice(amountIn, amountOut);
    
        return 100 - Number(100000n * expectedPrice / actualPrice)/1000
    }
}

function withFee(amount: bigint, isSwap: boolean) {
	const feePerThou = isSwap ? SWAP_PERTHOU : ORDER_PERTHOU;
	const fee = (amount * feePerThou) / 1000n;
	return {
		fee,
		remainder: amount - fee
	};
}

export function calcPrice(amount1: bigint, amount2: bigint) {
	return (amount1 * PRICE_PRECISION) / amount2;
}

function calcAmountOut(amount1: bigint, amountCcy: bigint, input: bigint, buyCcy: boolean) {
	const one = buyCcy ? amount1 : amountCcy;
	const two = buyCcy ? amountCcy : amount1;

	const output = two - (one * two) / (one + input);
	return withFee(output, true).remainder;
}

function calcInForOut(amount1: bigint, amountCcy: bigint, output: bigint, buyCcy: boolean) {
	const theoreticalOutput = (output * 1000n) / (1000n-SWAP_PERTHOU);

	const one = buyCcy ? amount1 : amountCcy;
	const two = buyCcy ? amountCcy : amount1;

    if (theoreticalOutput >= two ) throw new NotEnoughLiquidityError("Swap can't output more than the liquidity")
    
	const input = (one * two) / (two - theoreticalOutput) - one;
	return input;
}

function calcPriceAfterSwap(amount1: bigint, amountCcy: bigint, input: bigint, buyCcy: boolean) {
	const outAmount = calcAmountOut(amount1, amountCcy, input, buyCcy);
	const one = buyCcy ? amount1 + input : amount1 - outAmount;
	const two = buyCcy ? amountCcy - outAmount : amountCcy + input;
	return calcPrice(one, two);
}

function calcPriceAfterOutput(amount1: bigint, amountCcy: bigint, output: bigint, buyCcy: boolean) {
	const inAmount = calcInForOut(amount1, amountCcy, output, buyCcy);

	const one = buyCcy ? amount1 + inAmount : amount1 - output;
	const two = buyCcy ? amountCcy - output : amountCcy + inAmount;
	return calcPrice(one, two);
}

export async function getPairInfo(queryable: Queryable, assetId: BufferId) {
	const ccy = await getCcy();
	return mapPair(
		await queryable.query<PairResponse, { asset: Buffer }>({
			name: 'get_pair_info',
			args: { asset: formatter.ensureBuffer(assetId) }
		}),
		ccy
	);
}

function calcSwapAmountToPriceWithFees(
	amount1: bigint,
	amountCcy: bigint,
	price: bigint,
	buyCcy: boolean
) {
	const one = buyCcy ? amount1 : amountCcy;
	const two = buyCcy ? amountCcy : amount1;

	const b = 2n * one - withFee((two * price) / PRICE_PRECISION, true).fee;
	const c = one * one - (one * two * price) / PRICE_PRECISION;

	return (-b + sqrt(b * b - 4n * c)) / 2n;
}

export async function calcOutputIncludingOrders(
	queryable: Queryable,
	pair: Pair,
	amount: Amount,
	buyCcy: boolean
) {
    const expected = buyCcy ? pair.asset1.decimals : pair.ccy.decimals;

	if (expected !== amount.decimals) {
		throw new SwapError('Input amount does not match pair token');
	}
	let toPay = amount.value;
	let received = 0n;

	let amount1 = pair.amount1;
	let amountCcy = pair.amountCcy;

	const currPrice = calcPrice(pair.amount1, pair.amountCcy);
	const theoreticalEndPrice = calcPriceAfterSwap(
		pair.amount1,
		pair.amountCcy,
		amount.value,
		buyCcy
	);

	const orderPaginator = await getAllOrdersByPriceRange(
		queryable,
		pair.asset1,
		buyCcy ? currPrice : theoreticalEndPrice,
		buyCcy ? theoreticalEndPrice : currPrice
	);

	const nextOrder = sequentialize(orderPaginator);

	function swap(amount: bigint) {
        const rec = calcAmountOut(amount1, amountCcy, toPay, buyCcy);
		toPay -= amount;
		received += rec;
		amount1 += buyCcy ? amount : -rec;
		amountCcy += buyCcy ? -rec : amount;
	}

	function spendOnOrder(amount: bigint, order: Order) {
        if (amount === 0n) return
		const orderWorth = order.buyCcy
			? (order.amount.value * PRICE_PRECISION) / order.price
			: (order.amount.value * order.price) / PRICE_PRECISION;

		const input = amount <= orderWorth ? amount : orderWorth;
		const rec = order.buyCcy
			? (input * order.price) / PRICE_PRECISION
			: (input * PRICE_PRECISION) / order.price;

		received += rec;
		toPay -= input;
	}

    let lastLoopSafetyBreakout = 0n;
	while (toPay > 0n) {
		let amToNext = 0n;
		const o = await nextOrder();
		if (o) {
			const nextStop = o.price;
			amToNext = calcSwapAmountToPriceWithFees(amount1, amountCcy, nextStop, buyCcy);

			if (amToNext !== 0n) {
				swap(amToNext < toPay ? amToNext : toPay);
			}
			spendOnOrder(toPay, o);
		} else {
			swap(toPay);
		}

        if (toPay === lastLoopSafetyBreakout){
            toPay = 0n;
            if (lastLoopSafetyBreakout !== 0n) console.log("break out");
        }
        lastLoopSafetyBreakout = toPay;
	}

	return received;
}

export async function calcInputIncludingOrders(
	queryable: Queryable,
	pair: Pair,
	output: Amount,
	buyCcy: boolean
) {
	const expected = buyCcy ? pair.ccy.decimals : pair.asset1.decimals;

	if (expected !== output.decimals) {
		throw new SwapError('Output amount does not match pair token');
	}
	let toReceive = output.value;
	let paid = 0n;

	let amount1 = pair.amount1;
	let amountCcy = pair.amountCcy;

	const currPrice = calcPrice(pair.amount1, pair.amountCcy);
	let theoreticalEndPrice = 0n;
    try {
        theoreticalEndPrice = calcPriceAfterOutput(
            pair.amount1,
            pair.amountCcy,
            output.value,
            buyCcy
        );
    } catch (e) {
        if (!(e instanceof NotEnoughLiquidityError)) {
            throw e
        }
        theoreticalEndPrice = buyCcy? (PRICE_PRECISION*PRICE_PRECISION) : 0n;
    }

	const orderPaginator = await getAllOrdersByPriceRange(
		queryable,
		pair.asset1,
		buyCcy ? currPrice : theoreticalEndPrice,
		buyCcy ? theoreticalEndPrice : currPrice
	);

	const nextOrder = sequentialize(orderPaginator);

	function swap(amountOut: bigint) {
        let spent;
        try {
           spent = calcInForOut(amount1, amountCcy, toReceive, buyCcy);
        } catch(e) {
            if (!(e instanceof NotEnoughLiquidityError)) throw e
            throw new NotEnoughLiquidityError("Cannot reach the desired output. The liquidity is too low")
        }
		toReceive -= amountOut;
		paid += spent;
		amount1 += buyCcy ? spent : -amountOut;
		amountCcy += buyCcy ? -amountOut : spent;
	}

    function spendOnOrder(amountOut: bigint, order: Order) {
        if (amountOut <= 0n) return
		// amountOut is in same asset as order.amount.value

		// the least of (what the order can spend, what I want to receive)
		const desiredOut = amountOut <= order.amount.value ? amountOut : order.amount.value;

		const spent = buyCcy
			? (desiredOut * order.price) / PRICE_PRECISION
			: (desiredOut * PRICE_PRECISION) / order.price;
		paid += spent;
		toReceive -= desiredOut;
	}

    let lastLoopSafetyBreakout = 0n;
	while (toReceive > 0n) {
		const o = await nextOrder();
		if (o) {
			const nextStop = o.price;
			const inToNext = calcSwapAmountToPriceWithFees(amount1, amountCcy, nextStop, buyCcy);
            const outToNext = calcAmountOut(amount1, amountCcy, inToNext, buyCcy);

			swap(outToNext);
			spendOnOrder(toReceive, o);
		} else {
			swap(toReceive);
		}

        if (toReceive === lastLoopSafetyBreakout) {
            toReceive = 0n;
            if (lastLoopSafetyBreakout !== 0n) console.log("break out");
        }
        lastLoopSafetyBreakout = toReceive;
	}

	return paid;
}
