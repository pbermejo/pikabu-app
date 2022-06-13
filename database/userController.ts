import { db } from '.'
import { User } from '../models'
import bcrypt from 'bcryptjs'
import { ActivationHash } from '../models'

export const checkUserEmail = async (email: string) => {
	await db.connect()
	const user = await User.findOne({ email })
	await db.disconnect()

	if (!user) {
		return null
	}

	return user
}

export const checkActivationHash = async (hash: string) => {
	await db.connect()
	const activationHash = await ActivationHash.findOne({ _id: hash }).lean()
	await db.disconnect()

	if (!activationHash) {
		return null
	}

	return activationHash
}

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

// Creates oauth user
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
