import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { dbUsers } from '../../../database'

export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. "Sign in with...")
			name: 'Custom Login',
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				email: { label: 'Email', type: 'email', placeholder: 'correo@example.com' },
				password: { label: 'Password', type: 'password', placeholder: 'Contraseña' },
			},
			async authorize(credentials, req) {
				console.log({ credentials })
				// return { name: 'Pablo', correo: 'admin@pikabu.com', role: 'admin' }

				return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password)
			},
		}),
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
		}),
	],

	// Custom pages
	pages: {
		signIn: '/auth/login',
		newUser: '/auth/register',
	},

	session: {
		maxAge: 2592000, // 30 days
		strategy: 'jwt',
		updateAge: 86400, // Everyday
	},

	// Callbacks
	callbacks: {
		async jwt({ token, account, user }) {
			// console.log({ token, account, user })
			if (account) {
				token.accessToken = account.access_token

				switch (account.type) {
					case 'oauth':
						token.user = await dbUsers.oAuthToDbUser(user?.email || '', user?.name || '')
						break
					case 'credentials':
						token.user = user
						break
				}
			}
			return token
		},
		async session({ session, token, user }) {
			// console.log({ session, token, user })

			session.accessToken = token.accessToken
			session.user = token.user as any

			return session
		},
	},
})
