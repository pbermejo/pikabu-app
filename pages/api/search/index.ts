import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Contract for response data
 */
type Data = { message: string };

/**
 * Method for handling search endpoint
 * Example URL: http://localhost:3000/api/search
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	return res.status(400).json({
		message: "API[search] - Debe especificar el query de búsqueda",
	});
}
