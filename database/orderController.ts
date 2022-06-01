import { isValidObjectId } from 'mongoose'
import { db } from '.'
import { IOrder } from '../interfaces'
import { Order } from '../models'

/**
 * This file sums up methods for fetching data directly from the db.
 * It runs on server side only.
 */

/**
 * Method for finding an order by its id
 * @param id a string containing order id
 * @returns a JSON with serialized order
 */
export const getOrderById = async (id: string): Promise<IOrder | null> => {
	if (!isValidObjectId(id)) {
		return null
	}

	await db.connect()
	const order = await Order.findById(id).lean()
	await db.disconnect()

	if (!order) {
		return null
	}

	return JSON.parse(JSON.stringify(order))
}

/**
 * Method for finding an order by its user id
 * @param userId a string containing user id
 * @returns a JSON with serialized orders
 */
export const getOrdersByUser = async (userId: string): Promise<IOrder[]> => {
	if (!isValidObjectId(userId)) {
		return []
	}

	await db.connect()
	const orders = await Order.find({ user: userId }).lean()
	await db.disconnect()

	return JSON.parse(JSON.stringify(orders))
}
