import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '../../../database'
import Product from '../../../models/Product'
import { IProduct } from '../../../interfaces/products'

/**
 * Contract for response data
 */
type Data = { message: string } | IProduct[]

/**
 * Method for handling products endpoint
 * Example URL: http://localhost:3000/api/products
 * Example URL: http://localhost:3000/api/products?gender=women
 * Example URL: http://localhost:3000/api/products?gender=false
 * Example URL: http://localhost:3000/api/products?gender=
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case 'GET':
			return getProducts(req, res)

		default:
			return res.status(400).json({ message: 'API[products] - Bad request' })
	}
}

/**
 * Method for getting all products
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { gender = 'all' } = req.query

	let condition = {}

	if (gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`)) {
		condition = { gender }
	}

	await db.connect()
	const products = await Product.find(condition).select('title images price inStock slug -_id').lean()
	await db.disconnect()

	const updatedProducts = products.map(product => {
		product.images = product.images.map(image => {
			return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
		})

		return product
	})

	return res.status(200).json(updatedProducts)
}
