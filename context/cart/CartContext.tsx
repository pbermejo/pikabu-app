import { createContext } from 'react'
import { ICartProduct, ICartSummary, IShippingAddress } from '../../interfaces'

/**
 * Contract for cart context
 */
interface ContextProps {
	isLoaded: boolean
	cart: ICartProduct[]
	summary: ICartSummary
	shippingAddress?: IShippingAddress

	// Methods
	addProductToCart: (product: ICartProduct) => void
	removeProductSizeFromCart: (product: ICartProduct) => void
	updateCartQuantity: (product: ICartProduct) => void
	updateAddress: (shippingAddress: IShippingAddress) => void

	createOrder: () => Promise<{
		hasError: boolean
		message: string
	}>
}

/**
 * Creates an available context for cart props and methods
 */
export const CartContext = createContext({} as ContextProps)
