import type { NextApiRequest, NextApiResponse } from 'next'
import { mailer } from '@/components/email'

/**
 * Contract for response data
 */
type Data = { message: string }

/**
 * Method for handling email endpoint
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case 'POST':
			return sendEmail(req, res)

		default:
			return res.status(400).json({ message: 'API[email/sendEmail] - Bad request' })
	}
}

/**
 * Method for sending an email to an user
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
const sendEmail = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	let { email, hash } = req.body

	// Builds a reset password email and sends it
	let emailTransporter = await mailer()
	await emailTransporter.sendMail({
		subject: 'Pikabu - Reset Password',
		text: `Acceda a esta dirección para modificar su contraseña de forma segura o cópiala y pégala en el navegador: ${process.env.HOST_NAME}auth/reset-password/${hash}?email=${email}`,
		to: email,
		from: process.env.GOOGLE_EMAIL,
	})
	console.log('email sent to ' + email)

	res.status(200).json({ message: 'Email sent' })
}
