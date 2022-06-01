import type { NextApiRequest, NextApiResponse } from "next";
import { db, seedDatabase } from "../../database";
import { Product, User } from "../../models";

/**
 * Contract for response data
 */
type Data = {
	message: string;
};

/**
 * Method for handling seeding endpoint
 * Example URL: http://localhost:3000/api/seed
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (process.env.NODE_ENV === "production") {
		return res.status(401).json({
			message: "API[seed] No tiene acceso a este servicio en producción",
		});
	}

	await db.connect();

	await User.deleteMany();
	await User.insertMany(seedDatabase.initialData.users);

	await Product.deleteMany();
	await Product.insertMany(seedDatabase.initialData.products);

	await db.disconnect();

	res.status(200).json({
		message: "API[seed] Proceso realizado correctamente",
	});
}
