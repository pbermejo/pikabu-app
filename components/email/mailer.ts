import nodemailer from 'nodemailer'
import { google } from 'googleapis'

export const mailer = async() => {
	const oauth2Client = new google.auth.OAuth2(
		process.env.OAUTH_ID,
		process.env.OAUTH_SECRET,
		'https://developers.google.com/oauthplayground'
	)

	oauth2Client.setCredentials({
		refresh_token: process.env.OAUTH_REFRESH_TOKEN,
	})

	const accessToken = await new Promise((resolve, reject) => {
		oauth2Client.getAccessToken((err, token) => {
			if (err) {
				reject('Failed to create access token :(')
			}
			resolve(token)
		})
	})

	const transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			type: 'OAuth2',
			user: process.env.GOOGLE_EMAIL,
			accessToken,
			clientId: process.env.OAUTH_ID,
			clientSecret: process.env.OAUTH_SECRET,
			refreshToken: process.env.OAUTH_REFRESH_TOKEN,
		},
	})

	return transporter
}
