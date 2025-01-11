import { type Asset } from "@chromia/ft4";
import { AssetFilter } from "./types";
import type { BufferId } from "postchain-client";

export const CCY_ID = '111621bc8c2e1ae559b0573c136a874941fb0e9b4c5489f01ac026c2bda6ffc6';

export const ASSET_IDS = [
        CCY_ID,
        'e8470be82cce9b3b4f636bb1adafcc09d6e2743d847e9a792596c6766f524780',
        'c1e5d2b5ffdace44791de2b1f1cd27ded2b9ff25ae8ce99baabb24ba96598868',
        '3c5db4a3d4e91f90d10355399c8df02695e4f287e917c968ef6524462f368b04',
        '65173c5c360cbd8c0ed8dcfa22e7938239f4df34e0a5342c136b5cc5bd997433',
        'e796172c9c1f48d804b62d79f79415a8e84e0eba207019b3280bbcbce1430ac9',
];

export function getAssetFilter(i: number) {
    return [
        AssetFilter.ByName,
        AssetFilter.BySymbol,
        AssetFilter.ById,
    ][i];
}

export function filterAssets(assets: Asset[]) {
	return assets.filter(a => {
		const id = getId(a.id)
		return ASSET_IDS.includes(id);
	});
}

export function isVerified(id: Buffer) {
    return ASSET_IDS.includes(getId(id))
}

export function getId(id: BufferId) {
    return id.toString("hex").toLowerCase();
}

export function isCcy(asset: Asset) {
    return getId(asset.id) === CCY_ID;
}

export function shortenId(id: Buffer) {
    const str = id.toString('hex');
    return str.slice(0, 4) + '...' + str.slice(-4);
}

//================== ALERT UTILS =============================

export let alerter: (e:Error) => void = (e:Error) => {throw e}

export function setAlerter(a: (e: Error) => void) { alerter = a }

export let updateBalances = () => {}

export function setUpdater(a: () => void) { updateBalances = a }