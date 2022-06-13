import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose'
import bcrypt from 'bcryptjs'
import { db } from '../../../../database'
import User from '../../../../models/User'
import { IUser } from '../../../../interfaces/users'

/**
 * Contract for response data
 */
type Data = { message: string } | IUser

/**
 * Method for handling users endpoint
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case 'GET':
			return getUserById(req, res)
		case 'POST':
			return updateUser(req, res)

		default:
			return res.status(400).json({ message: 'API[users/id] - Bad request' })
	}
}

/**
 * Method for getting a user by its id
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
const getUserById = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { id } = req.query

	await db.connect()
	const user = await User.findOne({ id }).lean()
	await db.disconnect()

	if (!user) {
		return res.status(404).json({ message: 'API[users/id] - Usuario no encontrado' })
	}

	return res.status(200).json(user)
}

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { id } = req.query
	const { email, name, password, role } = req.body

	if (!isValidObjectId(id)) {
		return res.status(400).json({ message: 'No existe usuario por ese id' })
	}

	// TODO: Securize access

	await db.connect()
	const user = await User.findById(id)

	if (!user) {
		await db.disconnect()
		return res.status(404).json({ message: 'Usuario no encontrado: ' + id })
	}

	if (email) {
		user.email = email
	}

	if (name) {
		user.name = name
	}

	if (password) {
		user.password = bcrypt.hashSync(password)
	}

	if (role) {
		user.role = role
	}

	await user.save()
	await db.disconnect()

	return res.status(200).json(user)
}
