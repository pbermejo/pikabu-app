import { IUser, IShippingAddress, ICartSummary, ISize, IGender } from './'
/**
 * Contract for defining order
 */
export interface IOrder {
	_id?: string
	cartSummary: ICartSummary
	isPaid: boolean
	paidAt?: string
	orderItems: IOrderItem[]
	shippingAddress: IShippingAddress
	paymentResult?: string
	user?: IUser | string

	// Añadido createdAt y updatedAt de mongo
	createdAt?: string
	updatedAt?: string

	transactionId?: string
}

/**
 * Contract for defining order items
 */
export interface IOrderItem {
	_id: string
	gender: IGender
	image: string
	price: number
	quantity: number
	size: ISize
	slug: string
	title: string
}
