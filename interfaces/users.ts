/**
 * Contract for defining user
 */
export interface IUser {
	_id: string
	email: string
	name: string
	password?: string
	role: IRole

	// Añadido createdAt y updatedAt de mongo
	createdAt?: string
	updatedAt?: string
}

/**
 * Contract for defining user role
 */
export type IRole = 'super-user' | 'admin' | 'client'

/**
 * Contract for defining an user to be updated
 */
export interface IUserUpdate {
	_id: string
	email?: string
	name?: string
	password?: string
	role?: IRole
}

/**
 * Contract for defining an activation hash
 */
export interface IActivationHash {
	_id: string
	userId: string
}
