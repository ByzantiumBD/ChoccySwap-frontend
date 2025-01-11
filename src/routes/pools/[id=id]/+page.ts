import type { PageLoad } from './$types';

type Data = {
	params: { id: string }
}

export const load: PageLoad = ( data: Data ) => {
	return {
		id: data.params.id,
	};
};