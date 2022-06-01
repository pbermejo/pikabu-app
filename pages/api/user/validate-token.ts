import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { User } from '../../../models'
import { IRole } from '../../../interfaces'
import { jwt } from '../../../utils'

/**
 * Contract for response data
 */
type Data =
	| { message: string }
	| {
			token: string
			user: {
				email: string
				name: string
				role: IRole
			}
	  }

/**
 * Method for handling token validation endpoint
 * Example URL: http://localhost:3000/api/user/validate-token
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case 'GET':
			return checkJWT(req, res)
		default:
			res.status(400).json({
				message: 'API[validate-token] - Bad request',
			})
	}
}

/**
 * Method for logging in a registered user.
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { token = '' } = req.cookies || req.headers

	// Verify token and get user id
	let userId = ''
	try {
		userId = await jwt.isValidToken(token)
	} catch (error) {
		res.status(401).json({
			message: 'API[validate-token] - Token de autorización no es válido',
		})
	}

	// Get user from id
	await db.connect
	const user = await User.findById(userId).lean()
	await db.disconnect

	if (!user) {
		return res.status(400).json({
			message: 'API[validate-token] - No existe un usuario con id ' + userId,
		})
	}

	// Renew token and return user data
	const { _id, email, name, role } = user

	return res.status(200).json({
		token: jwt.signToken(_id, email), // Renew token
		user: {
			email,
			name,
			role,
		},
	})
}
