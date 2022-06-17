import { FC } from 'react'
import Head from 'next/head'
import { AppBar, Box, Link, Toolbar, Typography } from '@mui/material'
import NextLink from 'next/link'

/**
 * Contract for component props
 */
interface Props {
	title: string
}

/**
 * Layout component for authentication pages
 * @param param0 object implementing Props interface
 * @returns component layout in html
 */
export const AuthLayout: FC<Props> = ({ children, title }) => {
	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>

			<main>
				<AppBar>
					<Toolbar>
						{/* Logo */}
						<NextLink href='/' passHref>
							<Link display='flex' alignItems='center'>
								<Typography variant='h6'>Pikabu | </Typography>
								<Typography sx={{ marginLeft: 0.5, marginTop: 0.4 }}>Shop</Typography>
							</Link>
						</NextLink>
					</Toolbar>
				</AppBar>
				<Box display='flex' alignItems='center' justifyContent='center' height='calc(100vh - 200px)'>
					{children}
				</Box>
			</main>
		</>
	)
}
