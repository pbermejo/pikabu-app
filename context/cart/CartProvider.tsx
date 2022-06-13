import { FC, useEffect, useReducer } from 'react'
import Cookie from 'js-cookie'

import { ICartProduct, ICartSummary, IOrder, IShippingAddress } from '../../interfaces'
import { CartContext, cartReducer } from './'
import Cookies from 'js-cookie'
import { pikabuApi } from '../../api'
import axios from 'axios'

/**
 * Contract for cart state
 */
export interface CartState {
	isLoaded: boolean
	cart: ICartProduct[]
	summary: ICartSummary
	shippingAddress?: IShippingAddress
}

/**
 * Constant for cart initial state
 */
const CART_INITIAL_STATE: CartState = {
	isLoaded: false,
	cart: [],
	summary: {
		numberOfItems: 0,
		subTotal: 0,
		tax: 0,
		total: 0,
	},
	shippingAddress: undefined,
}

/**
 * Provides access to cart props and methods
 * @param param0
 * @returns FC
 */
export const CartProvider: FC = ({ children }) => {
	/**
	 * Hook for calling cart reducer
	 */
	const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

	/**
	 * Hook for dispatching a loading products action
	 * from products that may be saved on cookie.
	 */
	useEffect(() => {
		loadCartFromCookie()
	}, [])

	const loadCartFromCookie = () => {
		try {
			const cookieProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : []
			dispatch({
				type: '[Cart] - Load cart from cookies or storage',
				payload: cookieProducts,
			})
		} catch (error) {
			dispatch({ type: '[Cart] - Load cart from cookies or storage', payload: [] })
		}
	}

	/**
	 * Hook for dispatching a loading address action
	 * from cookies.
	 */
	useEffect(() => {
		const shippingAddress: IShippingAddress = {
			firstName: Cookies.get('firstName') || '',
			lastName: Cookies.get('lastName') || '',
			address: Cookies.get('address') || '',
			address2: Cookies.get('address2') || '',
			zip: Cookies.get('zip') || '',
			city: Cookies.get('city') || '',
			country: Cookies.get('country') || '',
			phone: Cookies.get('phone') || '',
		}
		dispatch({ type: '[Cart] - LoadAddress from Cookies', payload: shippingAddress })
	}, [])

	/**
	 * Hook for firing an event(setting a cookie)
	 * every time the state changes (on cart update).
	 * It is fired at least once.
	 */
	useEffect(() => {
		Cookie.set('cart', JSON.stringify(state.cart))
	}, [state.cart])

	/**
	 * Hook for firing an event(updates cart summary)
	 * every time the state changes (on cart update).
	 * It is fired at least once.
	 */
	useEffect(() => {
		const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0)
		const subTotal = state.cart.reduce((prev, current) => current.price * current.quantity + prev, 0)
		const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE) || 0

		const orderSummary: ICartSummary = {
			numberOfItems,
			subTotal,
			tax: subTotal * taxRate,
			total: subTotal * (taxRate + 1),
		}

		dispatch({ type: '[Cart] - Update order summary', payload: orderSummary })
	}, [state.cart])

	/**
	 * Method for adding a product to the cart
	 * Dispatches action
	 * @param product ICartProduct
	 * @returns void
	 */
	const addProductToCart = (product: ICartProduct) => {
		dispatch({ type: '[Cart] - Update products in cart', payload: product })
	}

	/**
	 * Method for updating product quantity on cart.
	 * Dispatches action
	 * @param product the product with the new quantity
	 */
	const updateCartQuantity = (product: ICartProduct) => {
		dispatch({ type: '[Cart] - Update product quantity in cart', payload: product })
	}

	/**
	 * Method for removing product size from cart.
	 * Dispatches action
	 * @param product the product with size to be removed
	 */
	const removeProductSizeFromCart = (product: ICartProduct) => {
		dispatch({ type: '[Cart] - Remove product size from cart', payload: product })
	}

	/**
	 * Method for updating address on summary.
	 * Dispatches action
	 * @param shippingAddress the address to what the product is going to be shipped
	 */
	const updateAddress = (shippingAddress: IShippingAddress) => {
		Cookies.set('firstName', shippingAddress.firstName)
		Cookies.set('lastName', shippingAddress.lastName)
		Cookies.set('address', shippingAddress.address)
		Cookies.set('address2', shippingAddress.address2 || '')
		Cookies.set('zip', shippingAddress.zip)
		Cookies.set('city', shippingAddress.city)
		Cookies.set('country', shippingAddress.country)
		Cookies.set('phone', shippingAddress.phone)

		dispatch({ type: '[Cart] - UpdateAddress', payload: shippingAddress })
	}

	const createOrder = async (): Promise<{ hasError: boolean; message: string }> => {
		if (!state.shippingAddress) {
			throw new Error('[CartProvider] - No delivery address found')
		}

		const body: IOrder = {
			orderItems: state.cart.map(p => ({ ...p, size: p.size! })),
			shippingAddress: state.shippingAddress,
			cartSummary: state.summary,
			isPaid: false,
		}

		try {
			const { data } = await pikabuApi.post('/orders', body)
			dispatch({ type: '[Cart] - Order complete' })

			return {
				hasError: false,
				message: data._id!,
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return {
					hasError: true,
					message: error.response?.data as string,
				}
			}

			return {
				hasError: true,
				message: '[CartProvider/createOrder] - Not controlled error',
			}

			console.log(error)
		}
	}

	/**
	 * Component Layout
	 */
	return (
		<CartContext.Provider
			value={{
				...state,

				// Expose methods
				addProductToCart,
				updateCartQuantity,
				removeProductSizeFromCart,
				updateAddress,
				createOrder,
			}}
		>
			{children}
		</CartContext.Provider>
	)
}
