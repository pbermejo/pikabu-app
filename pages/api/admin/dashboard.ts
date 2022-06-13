import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { Order, Product, User } from '../../../models'

/**
 * Contract for response data
 */
type Data = {
	numberOfOrders: number
	paidOrders: number // isPad true
	notPaidOrders: number
	numberOfClients: number // role: client
	numberOfProducts: number
	productsWithNoInventory: number // 0
	lowInventory: number // productos con 10 o menos
}

/**
 * Method for handling admin dashboard endpoint
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	await db.connect()

	// const numberOfOrders = await Order.count();
	// const paidOrders = await Order.find({ isPaid: true }).count();
	// const numberOfClients = await User.find({ role: 'client' }).count();
	// const numberOfProducts = await Product.count();
	// const productsWithNoInventory = await Product.find({ inStock: 0 }).count();
	// const lowInventory = await Product.find({ inStock: { $lte: 10 } }).count();
	const [numberOfOrders, paidOrders, numberOfClients, numberOfProducts, productsWithNoInventory, lowInventory] =
		await Promise.all([
			Order.count(),
			Order.find({ isPaid: true }).count(),
			User.find({ role: 'client' }).count(),
			Product.count(),
			Product.find({ inStock: 0 }).count(),
			Product.find({ inStock: { $lte: 10 } }).count(),
		])

	await db.disconnect()

	res.status(200).json({
		numberOfOrders,
		paidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInventory,
		lowInventory,
		notPaidOrders: numberOfOrders - paidOrders,
	})
}
