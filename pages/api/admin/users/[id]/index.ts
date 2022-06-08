import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose'
import { db } from '../../../../../database'
import User from '../../../../../models/User'
import { IUser } from '../../../../../interfaces/users'

/**
 * Contract for response data
 */
type Data = { message: string } | IUser

/**
 * Method for handling admin users endpoint
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case 'DELETE':
			return deleteUser(req, res)

		default:
			return res.status(400).json({ message: 'API[users/slug] - Bad request' })
	}
}

/**
 * Method for deleting a user by its id
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */

const deleteUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { id = '' } = req.query

	if (!isValidObjectId(id)) {
		return res.status(400).json({ message: 'El id del usuario no es válido' })
	}

	try {
		await db.connect()
		const user = await User.findById(id)
		if (!user) {
			await db.disconnect()
			return res.status(400).json({ message: 'No existe un usuario con ese ID' })
		}

		await user.delete()
		await db.disconnect()

		return res.status(200).json(user)
	} catch (error) {
		console.log(error)
		await db.disconnect()
		return res.status(400).json({ message: 'Revisar la consola del servidor' })
	}
}
