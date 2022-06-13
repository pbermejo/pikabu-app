import { db } from '.'
import { User } from '../models'
import bcrypt from 'bcryptjs'
import { ActivationHash } from '../models'

/**
 * Method for checking an email
 * @param email the email to be checked
 * @returns the user associated with the email, if exists
 */
export const checkUserEmail = async (email: string) => {
	await db.connect()
	const user = await User.findOne({ email })
	await db.disconnect()

	if (!user) {
		return null
	}

	return user
}

/**
 * Method for checking an activation hash
 * @param hash the id of the user activation hash
 * @returns the activation hash with the id
 */
export const checkActivationHash = async (hash: string) => {
	await db.connect()
	const activationHash = await ActivationHash.findOne({ _id: hash }).lean()
	await db.disconnect()

	if (!activationHash) {
		return null
	}

	return activationHash
}

/**
 * Method for checking if an email and a password corresponds to an user
 * @param email  the email to be checked
 * @param password  the password to be checked
 * @returns user properties if user exists, null if user not exists
 */
export const checkUserEmailPassword = async (email: string, password: string) => {
	await db.connect()
	const user = await User.findOne({ email })
	await db.disconnect()

	if (!user) {
		return null
	}

	if (!user) {
		return null
	}

	if (!bcrypt.compareSync(password, user.password!)) {
		return null
	}

	const { _id, name, role } = user
	return {
		_id,
		email: email.toLocaleLowerCase(),
		name,
		role,
	}
}

/**
 * Method for creating an OAuth user in db
 * @param oAuthEmail email of the OAuth user
 * @param oAuthName name of the OAuth user
 * @returns user properties of the new user
 */
export const oAuthToDbUser = async (oAuthEmail: string, oAuthName: string) => {
	await db.connect()
	const user = await User.findOne({ email: oAuthEmail })

	if (user) {
		await db.disconnect()
		const { _id, email, name, role } = user
		return { _id, email, name, role }
	}

	const newUser = new User({ email: oAuthEmail, name: oAuthName, password: '@', role: 'client' })
	await newUser.save()
	await db.disconnect()

	const { _id, email, name, role } = newUser
	return { _id, email, name, role }
}
