import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { getSession, signIn, getProviders } from 'next-auth/react'

import { Box, Button, Grid, TextField, Typography, Link, Chip, Divider } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'
import { useForm } from 'react-hook-form'

import { AuthLayout } from '../../components/layouts'
import { validations } from '../../utils'

/**
 * Contract for form data
 */
type FormData = {
	email: string
	password: string
}

/**
 * Page component for login
 * @returns component layout in html
 */
const LoginPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>()
	const router = useRouter()

	/**
	 * Show error state handler
	 */
	const [showError, setShowError] = useState(false)

	const [providers, setProviders] = useState<any>({})
	useEffect(() => {
		getProviders().then(prov => {
			setProviders(prov)
		})
	}, [])

	/**
	 * Validation conditions
	 */
	const passwordMinChars = Number(process.env.USER_PASSWORD_MIN_CHARS) || 6

	/**
	 * Method for handling login event
	 * @param param0 data from form
	 */
	const onLoginUser = async ({ email, password }: FormData) => {
		setShowError(false)

		await signIn('credentials', { email, password })
	}

	return (
		<AuthLayout title={'Login'}>
			<form onSubmit={handleSubmit(onLoginUser)} noValidate>
				<Box sx={{ width: 350, padding: '10px 20px' }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant='h1' component='h1'>
								Iniciar sesión
							</Typography>
							<Chip
								label='No se reconoce el usurio / contraseña'
								color='error'
								icon={<ErrorOutline />}
								className='fadeIn'
								sx={{ display: showError ? 'flex' : 'none' }}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								type='email'
								label='Email'
								variant='filled'
								fullWidth
								{...register('email', {
									required: 'Este campo es requerido',
									validate: validations.isEmail,
								})}
								error={!!errors.email}
								helperText={errors.email?.message}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								type='password'
								label='Contraseña'
								variant='filled'
								fullWidth
								{...register('password', {
									required: 'Este campo es requerido',
									minLength: {
										value: passwordMinChars,
										message: `Mínimo ${passwordMinChars} caracteres`,
									},
								})}
								error={!!errors.password}
								helperText={errors.password?.message}
							/>
						</Grid>

						<Grid item xs={12}>
							<Button type='submit' color='secondary' className='circular-btn' size='large' fullWidth>
								Entrar
							</Button>
						</Grid>

						<Grid item xs={12} display='flex' justifyContent={'end'}>
							<NextLink
								href={router.query.p ? `/auth/register?p=${router.query.p}` : '/auth/register'}
								passHref
							>
								<Link>¿No tienes cuenta?</Link>
							</NextLink>
						</Grid>

						<Grid item xs={12} display='flex' flexDirection='column' justifyContent={'end'}>
							<Divider sx={{ width: '100%', mb: 2 }} />
							{Object.values(providers).map((provider: any) => {
								if (provider.id === 'credentials') return <div key='credentials'></div>

								return (
									<Button
										key={provider.id}
										variant='outlined'
										fullWidth
										color='secondary'
										sx={{ mb: 1 }}
										className='circular-btn'
										onClick={() => signIn(provider.id)}
									>
										{provider.name}
									</Button>
								)
							})}
						</Grid>
					</Grid>
				</Box>
			</form>
		</AuthLayout>
	)
}

/**
 * Server side method for defining page props
 * before rendering to send to client
 * @param param0 request params
 * @returns a Promise containing page props
 */
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
	const session = await getSession({ req })

	const { p = '/' } = query

	if (session) {
		return {
			redirect: {
				destination: p.toString(),
				permanent: false,
			},
		}
	}
	return {
		props: {},
	}
}

export default LoginPage
