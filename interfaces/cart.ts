import { ISize, IGender } from './'

/**
 * Contract for products in cart
 */
export interface ICartProduct {
	_id: string
	gender: IGender
	image: string
	price: number
	quantity: number
	size?: ISize
	slug: string
	title: string
}

/**
 * Contract for product summary
 */
export interface ICartSummary {
	numberOfItems: number
	subTotal: number
	tax: number
	total: number
}

/**
 * Contract for shipping address
 */
export interface IShippingAddress {
	address: string
	address2?: string
	city: string
	country: string
	firstName: string
	lastName: string
	phone: string
	zip: string
}
