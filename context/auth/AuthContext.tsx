import { createContext } from 'react'
import { IUser, IUserUpdate } from '../../interfaces'

interface ContextProps {
	isLoggedIn: boolean
	user?: IUser

	// Methods
	loginUser: (email: string, password: string) => Promise<boolean>
	logout: () => void
	registerUser: (
		email: string,
		name: string,
		password: string
	) => Promise<{
		hasError: boolean
		message?: string
	}>

	updateUser: (updatedUser: IUserUpdate) => Promise<{
		hasError: boolean
		message?: string
	}>
}

export const AuthContext = createContext({} as ContextProps)
