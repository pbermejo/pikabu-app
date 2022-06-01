import jwt from "jsonwebtoken";
import { SearchOutlined } from "@mui/icons-material";

/**
 * Method for generating tokens
 * @param _id A string containing user id
 * @param email A string containing user email
 * @returns A string containing the json web token
 */
export const signToken = (_id: string, email: string): string => {
	if (!process.env.JWT_SECRET_SEED) {
		throw new Error(
			"No existe semilla de JWT - Revisar variables de entorno"
		);
	}

	return jwt.sign(
		{
			_id,
			email,
		},
		process.env.JWT_SECRET_SEED,
		{
			expiresIn: "30d",
		}
	);
};

/**
 * Method for verifying tokens
 * @param token Method for checking tokens
 * @returns A promise resolved with data if token is valid. On error it rejects promise with error.
 */
export const isValidToken = (token: string): Promise<string> => {
	if (!process.env.JWT_SECRET_SEED) {
		throw new Error(
			"No existe semilla de JWT - Revisar variables de entorno"
		);
	}

	return new Promise((resolve, reject) => {
		try {
			jwt.verify(
				token,
				process.env.JWT_SECRET_SEED || "",
				(err, payload) => {
					if (err) return reject("JWT no es válido");
					const { _id } = payload as { _id: string };
					resolve(_id);
				}
			);
		} catch (error) {
			reject("JWT no es válido");
		}
	});
};
