import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import Product from "../../../models/Product";
import { IProduct } from "../../../interfaces/products";

/**
 * Contract for response data
 */
type Data = { message: string } | IProduct[];

/**
 * Method for handling search endpoint
 * Example URL: http://localhost:3000/api/search/shirt
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
			return searchProducts(req, res);

		default:
			return res
				.status(400)
				.json({ message: "API[search/query] -  Bad request" });
	}

	res.status(200).json({
		message: "API[search/query] - Proceso realizado correctamente",
	});
}

/**
 * Method for getting products by a passed query.
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
const searchProducts = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	console.log("query", req.query);
	let { query = "" } = req.query;
	if (query.length === 0) {
		return res
			.status(400)
			.json({
				message:
					"API[search/query] - Debe especificar el query de búsqueda",
			});
	}

	query = query.toString().toLowerCase();

	await db.connect();
	const products = await Product.find({
		$text: { $search: query },
	})
		.select("title images price inStock slug -_id")
		.lean();
	await db.disconnect();

	return res.status(200).json(products);
};
