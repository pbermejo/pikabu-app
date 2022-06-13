import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../../database'
import User from '../../../../models/User'
import { IUser, IActivationHash } from '../../../../interfaces/users'
import ActivationHash from '../../../../models/ActivationHashes'

/**
 * Contract for response data
 */
type Data = { message: string } | IUser[] | { user: IUser; hash: IActivationHash }

/**
 * Method for handling password endpoint
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case 'POST':
			return resetPassword(req, res)

		default:
			return res.status(400).json({ message: 'API[users/resetPassword] - Bad request' })
	}
}

/**
 * Method for getting all users
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
const resetPassword = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { email } = req.body

	// Get user info from email
	await db.connect()
	const user = await User.findOne({ email }).select('email').lean()
	await db.disconnect()

	if (!user) {
		return res.status(401).json({ message: 'No existe ese usuario' })
	}

	// Create an activation hash associated to user
	const hash = new ActivationHash({
		userId: user._id,
	})

	try {
		await db.connect()
		await hash.save({ validateBeforeSave: true })
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			message: 'Error al registrar token de activación',
		})
	} finally {
		await db.disconnect()
	}

	return res.status(200).json({ user, hash })
}
