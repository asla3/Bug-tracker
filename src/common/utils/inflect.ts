const inflect =
	(singular: string, plural = singular + 's') =>
	(quantity: number) =>
		quantity === 1 ? singular : plural;

export default inflect;
