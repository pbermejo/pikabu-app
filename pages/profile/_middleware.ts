import { getToken } from 'next-auth/jwt'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

/**
 * Server side method for checking if user is logged.
 * It performs validations before serving page to client.
 * If user is logged in navigates to next page.
 * If user is not logged in navigates to login
 * with return page request param
 * @param req
 * @param ev
 * @returns a promise with the response
 */
export async function middleware(req: NextRequest, ev: NextFetchEvent) {
	const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

	if (!session) {
		const { origin, pathname } = req.nextUrl.clone()
		return NextResponse.redirect(`${origin}/auth/login?p=${pathname}`)
	}

	return NextResponse.next()
}
