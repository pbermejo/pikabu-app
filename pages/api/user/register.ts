import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'

import { db } from '../../../database'
import { User } from '../../../models'
import { IRole } from '../../../interfaces'
import { jwt, validations } from '../../../utils'

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
 * Method for handling register endpoint
 * Example URL: http://localhost:3000/api/user/register
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case 'POST':
			return registerUser(req, res)
		default:
			res.status(400).json({ message: 'API[register] - Bad request' })
	}
}

/**
 * Method for registering a new user on DB.
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { email = '', password = '', name = '' } = req.body as { email: string; password: string; name: string }

	const passwordMinChars = Number(process.env.USER_PASSWORD_MIN_CHARS) || 6
	const nameMinChars = Number(process.env.USER_NAME_MIN_CHARS) || 2

	// DO VALIDATIONS

	if (password.length < passwordMinChars) {
		return res.status(400).json({
			message: `API[register] - La contraseña debe tener ${passwordMinChars} caracteres como mínimo`,
		})
	}

	if (name.length < nameMinChars) {
		return res.status(400).json({
			message: `API[register] - El nombre debe tener ${nameMinChars} caracteres como mínimo`,
		})
	}

	if (!validations.isValidEmail(email)) {
		return res.status(400).json({
			message: 'API[register] - El email no es válido',
		})
	}

	await db.connect()
	const user = await User.findOne({ email })
	await db.disconnect()

	if (user) {
		return res.status(400).json({
			message: 'API[register] - Ese correo no es válido o está registrado',
		})
	}

	// CREATE USER

	const newUser = new User({
		email: email.toLocaleLowerCase(),
		name,
		password: bcrypt.hashSync(password),
		role: 'client',
	})

	// SAVE USER TO DB

	try {
		await db.connect()
		await newUser.save({ validateBeforeSave: true })
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			message: 'API[register] - Error al registrar usuario - revisar logs de servidor',
		})
	} finally {
		await db.disconnect()
	}

	// RETURN CREATED USER

	const { _id, role } = new User()
	const token = jwt.signToken(_id, email)

	return res.status(200).json({
		token,
		user: {
			email,
			name,
			role,
		},
	})
}
