import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose'
import { db } from '../../../../database'
import { IUser } from '../../../../interfaces'
import { User } from '../../../../models'

/**
 * Contract for response data
 */
type Data = { message: string } | IUser[]

/**
 * Method for handling admin users endpoint
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case 'GET':
			return getUsers(req, res)

		default:
			return res.status(400).json({ message: 'Bad request' })
	}
}

/**
 * Method for getting all users
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	await db.connect()
	const users = await User.find().select('-password').lean()
	await db.disconnect()

	return res.status(200).json(users)
}
