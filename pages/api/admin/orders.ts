import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { Order } from '../../../models'
import { IOrder } from '../../../interfaces'

/**
 * Contract for response data
 */
type Data = { message: string } | IOrder[]

/**
 * Method for handling admin orders endpoint
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case 'GET':
			return getOrders(req, res)

		default:
			return res.status(400).json({ message: 'Bad request' })
	}
}

/**
 * Method for getting all products
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
const getOrders = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	await db.connect()
	const orders = await Order.find().sort({ createdAt: 'desc' }).populate('user', 'name email').lean()
	await db.disconnect()

	return res.status(200).json(orders)
}
