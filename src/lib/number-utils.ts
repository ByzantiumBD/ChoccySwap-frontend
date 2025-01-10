import { calcPrice, PRICE_PRECISION } from "./interactions/swaps";
import type { Pair } from "./types";


export function shortenNumber(number: string) {
    const integer = number.replace(/^0+(?=[1-9])/, "").match(/^\d+/)?.[0];
    const decimal = number.match(/(?<=\.)\d+$/)?.[0];

    if (integer === undefined || integer.match(/^0+$/)) {
        if (decimal === undefined) return "0";
        return "0."+decimal.slice(0,6)
    } else {
        if (decimal === undefined || decimal.match(/^0+$/)) return integer
        return integer+"."+decimal.slice(0,3)
    }
}

export function makeNumberReadable(number: string) {
    const integer = number.match(/^\d+/)?.[0];
    const decimal = number.match(/(?<=\.)\d+$/)?.[0];

    if (integer === undefined) {
        if (decimal === undefined) return "0";
        return "0."+decimal.slice(0,3)
    } else {
        return addPostfix(Number(number))
    }
}

function addPostfix(num: number) {
    const postfixes = [
        "", "k", "M", "B", "T", "Q"
    ]

    function trunc(str: string) {
        return str.match(/^\d*(\.\d{1,3})?/)?.[0]??"0";
    }

    let myNum = num;
    for (let i = 0; i < postfixes.length; i++) {
        if (myNum / 1000 < 1) {
            return trunc(myNum.toString()) + postfixes[i];
        }
        myNum = myNum /1000;
    }

    return trunc(myNum.toString())+postfixes[postfixes.length-1]
}

export function getReadablePrice(pair: Pair) {    
    const priceInCcy = calcPrice(pair.amount1, pair.amountCcy)/PRICE_PRECISION;
    const priceInAsset = calcPrice(pair.amountCcy, pair.amount1)/PRICE_PRECISION;

    const ordersMagnitudeDifference = 1;
}