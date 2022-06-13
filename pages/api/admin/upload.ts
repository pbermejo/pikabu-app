import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'

import { v2 as cloudinary } from 'cloudinary'
cloudinary.config(process.env.CLOUDINARY_URL || '')

/**
 * contract for data response
 */
type Data = {
	message: string
}

/**
 * Public contract for config
 */
export const config = {
	api: {
		bodyParser: false,
	},
}

/**
 * Method for handling admin upload endpoint
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case 'POST':
			return uploadFile(req, res)

		default:
			res.status(400).json({ message: 'Bad request' })
	}
}

/**
 * Method for saving a file
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
const saveFile = async (file: formidable.File): Promise<string> => {
	// const data = fs.readFileSync( file.filepath );
	// fs.writeFileSync(`./public/${ file.originalFilename }`, data);
	// fs.unlinkSync( file.filepath ); // elimina
	// return;
	const { secure_url } = await cloudinary.uploader.upload(file.filepath)
	return secure_url
}

/**
 * Method for parsing files
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
const parseFiles = async (req: NextApiRequest): Promise<string> => {
	return new Promise((resolve, reject) => {
		const form = new formidable.IncomingForm()
		form.parse(req, async (err, fields, files) => {
			// console.log({ err, fields, files });

			if (err) {
				return reject(err)
			}

			const filePath = await saveFile(files.file as formidable.File)
			resolve(filePath)
		})
	})
}

/**
 * Method for uploading a file
 * @param req An object with the request
 * @param res An object with the response
 * @returns NextApiResponse<Data> A REST API Response with data requested.
 * On error returns a response with corresponding code and error
 */
const uploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const imageUrl = await parseFiles(req)

	return res.status(200).json({ message: imageUrl })
}
