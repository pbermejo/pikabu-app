/**
 * Method for formatting a number into a local currency
 * @param value a number to be formated
 * @returns a string with the formatted value
 */
export const format = (value: number): String => {
	const formatter = new Intl.NumberFormat(process.env.NEXT_PUBLIC_LOCALE || '€', {
		style: 'currency',
		currency: process.env.NEXT_PUBLIC_CURRENCY,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})

	return formatter.format(value)
}
