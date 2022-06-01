import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../database";
import Product from "../../../../models/Product";
import { IProduct } from "../../../../interfaces/products";

/**
 * Contract for response data
 */
type Data = { message: string } | IProduct;

/**
 * Method for handling products endpoint
 * Example URL: http://localhost:3000/api/products/mens_chill_crew_neck_sweatshirt
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case "GET":
			return getProductBySlug(req, res);

		default:
			return res
				.status(400)
				.json({ message: "API[products/slug] - Bad request" });
	}

	res.status(200).json({
		message: "API[products/slug] - Proceso realizado correctamente",
	});
}

/**
 * Method for getting a product by its slug
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
const getProductBySlug = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const { slug } = req.query;

	await db.connect();
	const product = await Product.findOne({ slug }).lean();
	await db.disconnect();

	if (!product) {
		return res
			.status(404)
			.json({ message: "API[products/slug] - Producto no encontrado" });
	}

	return res.status(200).json(product);
};
