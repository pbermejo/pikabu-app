import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose'
import bcrypt from 'bcryptjs'
import { db } from 'database'
import { IActivationHash } from 'interfaces'
import { ActivationHash } from 'models'

/**
 * Contract for response data
 */
type Data = { message: string } | IActivationHash

/**
 * Method for handling activation hashes endpoint
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case 'DELETE':
			return deleteActivationHash(req, res)

		default:
			return res.status(400).json({ message: 'API[activationHash] - Bad request' })
	}
}

/**
 * Method for getting a user by its id
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
const deleteActivationHash = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { id } = req.query

	try {
		await db.connect()
		const hash = await ActivationHash.findById(id)
		if (!hash) {
			await db.disconnect()
			return res.status(400).json({ message: 'No existe un hash con ese ID' })
		}
		await hash.delete()
		await db.disconnect()
	} catch (error) {
		await db.disconnect()
		return res.status(500).json({ message: 'API[activationHash/delete] - Unable to delete activation hash' })
	}
	return res.status(200).json({ message: 'API[activationHash/delete] - Activation hash deleted' })
}
