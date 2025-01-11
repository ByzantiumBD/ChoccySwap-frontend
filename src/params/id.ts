import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string) => {
	return param.match(/^[a-f0-9]{64}$/i)? true : false;
}) satisfies ParamMatcher;