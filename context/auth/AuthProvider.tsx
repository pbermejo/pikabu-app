import { FC, useReducer, useEffect } from 'react'
import { IUser } from '../../interfaces'
import { AuthContext, authReducer } from './'
import { pikabuApi } from '../../api'
import Cookies from 'js-cookie'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useSession, signOut } from 'next-auth/react'

/**
 * Contract for auth state
 */
export interface AuthState {
	isLoggedIn: boolean
	user?: IUser
}

/**
 * Constant for auth initial state
 */
const AUTH_INITIAL_STATE: AuthState = {
	isLoggedIn: false,
	user: undefined,
}

/**
 * Provides access to auth props and methods
 * @param param0
 * @returns component layout
 */
export const AuthProvider: FC = ({ children }) => {
	/**
	 * Hook for calling auth reducer
	 */
	const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)

	const router = useRouter()

	const { data, status } = useSession()

	/**
	 * Hook for firing an event(login automatically if user token is valid)
	 * every time the state changes ().
	 * It is fired at least once.
	 */
	useEffect(() => {
		// autoLogin()
		if (status === 'authenticated') {
			console.log({ user: data?.user })
			dispatch({ type: '[Auth] - Login', payload: data?.user as IUser })
		}
	}, [status, data])

	/**
	 * DEPRECATED: Method for login an user automatically if user token is valid
	 */
	const autoLogin = async () => {
		// Avoid request if token does not exist
		if (!Cookies.get('token')) {
			return
		}

		try {
			const { data } = await pikabuApi.get('/user/validate-token')

			const { token, user } = data
			Cookies.set('token', token)
			dispatch({ type: '[Auth] - Login', payload: user })
		} catch (error) {
			Cookies.remove('token')
		}
	}

	/**
	 * Method for login an user and saving token on cookie
	 * @param email
	 * @param password
	 * @returns true if action is OK. False if an error occurs
	 */
	const loginUser = async (email: string, password: string): Promise<boolean> => {
		try {
			const { data } = await pikabuApi.post('/user/login', {
				email,
				password,
			})

			const { token, user } = data
			Cookies.set('token', token)
			dispatch({ type: '[Auth] - Login', payload: user })
			return true
		} catch (error) {
			return false
		}
	}

	/**
	 * Method for registering an user and saving token on cookie
	 * @param email
	 * @param password
	 * @returns true if action is OK. False if an error occurs
	 */
	const registerUser = async (
		email: string,
		name: string,
		password: string
	): Promise<{ hasError: boolean; message?: string }> => {
		try {
			const { data } = await pikabuApi.post('/user/register', {
				email,
				name,
				password,
			})
			const { token, user } = data
			Cookies.set('token', token)
			dispatch({ type: '[Auth] - Login', payload: user })
			return {
				hasError: false,
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return {
					hasError: true,
					message: error.response?.data.message as string,
				}
			}

			return {
				hasError: true,
				message: '[Auth/register] - No se pudo crear el usuario - intente de nuevo',
			}
		}
	}

	const logout = () => {
		Cookies.remove('cart')
		Cookies.remove('firstName')
		Cookies.remove('lastName')
		Cookies.remove('address')
		Cookies.remove('address2')
		Cookies.remove('zip')
		Cookies.remove('city')
		Cookies.remove('country')
		Cookies.remove('phone')
		signOut()
	}

	/**
	 * Component Layout
	 */
	return (
		<AuthContext.Provider
			value={{
				...state,

				// Methods
				loginUser,
				registerUser,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
