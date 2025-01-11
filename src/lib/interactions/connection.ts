// import type { ChainStats } from "$lib/types";
import { MissingAccountError, OfflineError, TooManyAccountsError } from '$lib/errors';
import { getId } from '$lib/utils';
import {
	createConnection,
	type Connection,
	type Session,
	createGenericEvmKeyStore,
	createKeyStoreInteractor
} from '@chromia/ft4';
import { createClient, encryption, TxRejectedError } from 'postchain-client';

let connection: Connection | undefined;
let session: Session | undefined;
// let chainStats: ChainStats | undefined;

export async function getConnection(): Promise<Connection> {
	if (connection === undefined) {
		const client = await createClient({
			directoryNodeUrlPool: [
				'https://node0.testnet.chromia.com:7740',
				'https://node1.testnet.chromia.com:7740',
				'https://node2.testnet.chromia.com:7740',
				'https://node3.testnet.chromia.com:7740'
			],
			blockchainRid: 'fa289e086e3d6c3277336e270baddf75035c1f049f242ab2cf61773d2822213d'
		});

		connection = createConnection(client);
		// chainStats = await client.query("get_chain_stats") as ChainStats;
	}
	return connection;
}

export async function connectWithEvmAccount(
	address: string,
	signMessage: (msg: string) => Promise<string>
) {
	if (
		session &&
		(
			getId(session.account.id) ===
			address.toLowerCase().replace("0x", "")
		)
	) return session;

	const connection = await getConnection();

	if (connection === undefined) {
		throw new OfflineError(
			"Couldn't connect to the blockchain. Please try again or reload the page."
		);
	}

	const ks = await createGenericEvmKeyStore({
		address,
		signMessage,
		isInteractive: true
	});
	const { getAccounts, getSession } = createKeyStoreInteractor(connection.client, ks);

	let accs = await getAccounts();
	if (!accs.length) {
		// throw new MissingAccountError('No account found. Please create one through the Chromia Vault.');
		try {
			await connection.client.signAndSendUniqueTransaction(
				{ name: 'create_account', args: [ks.address] },
				encryption.makeKeyPair()
			);
		} catch (e) {
			if (e instanceof TxRejectedError && e.message.match("duplicate key")) {
				// ignore
				console.log("Duplicate transaction sent. Ignoring.")
			} else {
				throw e
			}
		}
		accs = await getAccounts();
		if (!accs.length) {
			throw new MissingAccountError('No account found. Account creation failed');
		}
	}
	if (accs.length === 1) {
		session = await getSession(accs[0].id);
	} else {
		throw new TooManyAccountsError('Too many accounts found. Please contact us on Telegram.');
	}
	return session;
}

export function getSession() {
	return session;
}

export function disconnect() {
	session = undefined;
}
