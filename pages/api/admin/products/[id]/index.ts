import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose'
import { db } from '../../../../../database'
import Product from '../../../../../models/Product'
import { IProduct } from '../../../../../interfaces/products'

/**
 * Contract for response data
 */
type Data = { message: string } | IProduct

/**
 * Method for handling admin product endpoint
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case 'DELETE':
			return deleteProduct(req, res)

		default:
			return res.status(400).json({ message: 'API[products/slug] - Bad request' })
	}
}

/**
 * Method for deleting a product by its id
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
const deleteProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { id = '' } = req.query

	if (!isValidObjectId(id)) {
		return res.status(400).json({ message: 'El id del producto no es válido' })
	}

	try {
		await db.connect()
		const product = await Product.findById(id)
		if (!product) {
			await db.disconnect()
			return res.status(400).json({ message: 'No existe un producto con ese ID' })
		}

		await product.delete()
		await db.disconnect()

		return res.status(200).json(product)
	} catch (error) {
		console.log(error)
		await db.disconnect()
		return res.status(400).json({ message: 'Revisar la consola del servidor' })
	}
}
