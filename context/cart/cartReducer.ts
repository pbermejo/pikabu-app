import { ICartProduct, ICartSummary, IShippingAddress } from '../../interfaces'
import { CartState } from './'

/**
 * Contract for cart actions
 */
type CartActionType =
	| { type: '[Cart] - Load cart from cookies or storage'; payload: ICartProduct[] }
	| { type: '[Cart] - Remove product size from cart'; payload: ICartProduct }
	| { type: '[Cart] - Update product quantity in cart'; payload: ICartProduct }
	| { type: '[Cart] - Update products in cart'; payload: ICartProduct }
	| { type: '[Cart] - Update order summary'; payload: ICartSummary }
	| { type: '[Cart] - LoadAddress from Cookies'; payload: IShippingAddress }
	| { type: '[Cart] - UpdateAddress'; payload: IShippingAddress }
	| { type: '[Cart] - Order complete' }

export const cartReducer = (state: CartState, action: CartActionType): CartState => {
	switch (action.type) {
		case '[Cart] - Load cart from cookies or storage':
			return {
				...state,
				isLoaded: true,
				cart: [...action.payload],
			}

		case '[Cart] - Update products in cart':
			const productInCart = state.cart.some(p => p._id === action.payload._id)
			const productInCartButDifferentSize = state.cart.some(
				p => p._id === action.payload._id && p.size === action.payload.size
			)

			let cart: ICartProduct[] = []

			if (productInCart && productInCartButDifferentSize) {
				// Accumulates quantities and groups products
				cart = state.cart.map(p => {
					if (p._id === action.payload._id && p.size === action.payload.size) {
						p.quantity += action.payload.quantity
					}

					return p
				})
			} else {
				// Adds products to existing ones
				cart = [...state.cart, action.payload]
			}

			return {
				...state,
				cart,
			}

		case '[Cart] - Update product quantity in cart':
			return {
				...state,
				cart: state.cart.map(p => {
					if (p._id !== action.payload._id) return p
					if (p.size !== action.payload.size) return p

					return action.payload
				}),
			}

		case '[Cart] - Remove product size from cart':
			return {
				...state,
				cart: state.cart.filter(p => {
					if (p._id === action.payload._id && p.size === action.payload.size) return false

					return true
				}),
			}

		case '[Cart] - Update order summary':
			return {
				...state,
				summary: action.payload,
			}

		case '[Cart] - LoadAddress from Cookies':
		case '[Cart] - UpdateAddress':
			return {
				...state,
				shippingAddress: action.payload,
			}

		case '[Cart] - Order complete':
			return {
				...state,
				cart: [],
				summary: {} as ICartSummary,
			}

		default:
			return state
	}
}
