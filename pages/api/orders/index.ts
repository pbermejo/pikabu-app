import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { IOrder } from '../../../interfaces'
import { connect } from '../../../database/dbDriver'
import { db } from '../../../database'
import { Order, Product } from '../../../models'

/**
 * Contract for response data
 */
type Data = { message: string } | IOrder

/**
 * Method for handling orders endpoint
 * Example URL: http://localhost:3000/api/orders
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case 'POST':
			return createOrder(req, res)

		default:
			return res.status(400).json({ message: 'API[orders] - Bad request' })
	}
	res.status(200).json({ message: 'Example' })
}

/**
 * Method for creating an order
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { orderItems, cartSummary } = req.body as IOrder

	// Check user session
	const session: any = await getSession({ req })
	if (!session) {
		return res.status(401).json({ message: 'API[orders/] - User must be authenticated to create orders' })
	}

	// Create array of products
	const productsIds = orderItems.map(p => p._id)
	await db.connect()
	const dbProducts = await Product.find({ _id: { $in: productsIds } })

	// Create order on DB
	try {
		const subTotal = orderItems.reduce((prev, current) => {
			const currentPrice = dbProducts.find(p => p.id === current._id)?.price
			if (!currentPrice) {
				throw new Error('API[orders/] - Product does not exist. Please verify cart')
			}
			return currentPrice * current.quantity + prev
		}, 0)

		const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE) || 0
		const total = subTotal * (taxRate + 1)

		if (cartSummary.total !== total) {
			throw new Error('API[orders/] - Total purchase amount does not match. Please verify cart')
		}

		const userId = session.user._id
		const newOrder = new Order({ ...req.body, isPaid: false, user: userId })
		// Round to 2 decimals
		newOrder.cartSummary.total = Math.round(newOrder.cartSummary.total * 100) / 100
		await newOrder.save()
		await db.disconnect()

		return res.status(201).json(newOrder)
	} catch (error: any) {
		await db.disconnect()
		console.log(error)

		return res.status(400).json({ message: error.message || 'API[orders/] - Check server errors log' })
	}
}
