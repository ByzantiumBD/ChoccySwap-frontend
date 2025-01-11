import {
	createAppKit,
	type PublicStateControllerState,
	type UseAppKitAccountReturn
} from '@reown/appkit';
import { mainnet, bsc, avalanche } from '@reown/appkit/networks';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import type { Eip1193Provider } from 'ethers';
import { connectWithEvmAccount, disconnect } from './connection';
import { WalletError } from '$lib/errors';
import { updateBalances } from '$lib/utils';

// Get projectId from https://cloud.reown.com
const projectId = "bd9f15cbf71849a70415487e71be2bf9";

// Configure the metadata
const metadata = {
	name: 'ChoccySwap',
	description: 'Sweetest DEX on Chromia',
	url: 'https://www.choccyswap.com/', // origin must match your domain & subdomain
	icons: ['https://www.choccyswap.com/logo.svg']
};

// 3. Create the modal
export const modal = createAppKit({
	adapters: [new EthersAdapter()],
	networks: [mainnet, bsc, avalanche],
	metadata,
	projectId,
	features: {
		analytics: true // Optional - defaults to your Cloud configuration
	}
});

let account: UseAppKitAccountReturn | undefined = undefined;
let provider: Eip1193Provider | undefined = undefined;
const updaters: Array<() => void> = [];

modal.subscribeProviders((state) => (provider = state['eip155'] as Eip1193Provider));
modal.subscribeAccount(switchAccount);
modal.subscribeState(updateState);

async function signMessage(msg: string) {
	if (provider && account?.address) {
		return (await provider.request({
			method: 'personal_sign',
			params: [msg, account.address]
		})) as string;
	} else {
		throw new WalletError('Please connect before signing a message.');
	}
}
function updateUI() {
	updaters.forEach((updater) => updater());
	updateBalances();
}

function switchAccount(newState: UseAppKitAccountReturn) {
	account = newState;
	if (account.address && provider) {
		connectWithEvmAccount(account.address, signMessage).then(() => {
			updateBalances();
			updateUI();
		});
	} else {
		disconnect();
	}
}
function updateState(newState: PublicStateControllerState) {
  if (
    newState.initialized &&
    modal.getIsConnectedState() &&
    account?.address &&
    !newState.loading
  ) {
    connectWithEvmAccount(account.address, signMessage).then(() => updateUI());
	}
}

export function subscribeToModal(updater: () => void) {
  updaters.push(updater);
}

export async function disconnectModal() {
  await modal.disconnect();
  disconnect();
  updateUI();
}