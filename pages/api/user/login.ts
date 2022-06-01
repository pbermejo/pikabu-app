import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import bcrypt from "bcryptjs";
import { IRole } from "../../../interfaces";
import { jwt } from "../../../utils";

/**
 * Contract for response data
 */
type Data =
	| { message: string }
	| {
			token: string;
			user: {
				email: string;
				name: string;
				role: IRole;
			};
	  };

/**
 * Method for handling login endpoint
 * Example URL: http://localhost:3000/api/user/login
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case "POST":
			return loginUser(req, res);
		default:
			res.status(400).json({
				message: "API[login] -  - Bad request",
			});
	}
}

/**
 * Method for logging in a registered user.
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { email = "", password = "" } = req.body as {
		email: string;
		password: string;
	};

	await db.connect;
	const user = await User.findOne({ email }).lean();
	await db.disconnect;

	if (!user) {
		return res
			.status(400)
			.json({ message: "API[login] - Correo no válido" });
	}

	if (!bcrypt.compareSync(password, user.password!)) {
		return res
			.status(400)
			.json({ message: "API[login] - Contraseña no válida" });
	}

	const { role, name, _id } = user;
	const token = jwt.signToken(_id, email);

	return res.status(200).json({
		token,
		user: {
			email,
			name,
			role,
		},
	});
};
