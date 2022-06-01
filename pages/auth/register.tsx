import { useContext, useState } from 'react'
import { GetServerSideProps } from 'next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { Box, Button, Grid, TextField, Typography, Link, Chip } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'
import { useForm } from 'react-hook-form'

import { AuthLayout } from '../../components/layouts'
import { validations } from '../../utils'
import { AuthContext } from '../../context'
import { getSession, signIn } from 'next-auth/react'

/**
 * Contract for form data
 */
type FormData = {
	email: string
	name: string
	password: string
}

/**
 * Page component for register
 * @returns component layout in html
 */
const RegisterPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>()

	/**
	 * Show error state handler
	 */
	const [showError, setShowError] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const { registerUser } = useContext(AuthContext)
	const router = useRouter()

	/**
	 * Validation conditions
	 */
	const passwordMinChars = Number(process.env.USER_PASSWORD_MIN_CHARS) || 6
	const nameMinChars = Number(process.env.USER_NAME_MIN_CHARS) || 2

	/**
	 * Method for handling register event
	 * Tries to register an user and navigate back to the page the user was
	 * OR shows an error message
	 * @param param0 data from form
	 * @returns a Promise
	 */
	const onRegisterUser = async ({ email, name, password }: FormData) => {
		setShowError(false)

		const { hasError, message } = await registerUser(email, name, password)

		if (hasError) {
			setShowError(true)
			setErrorMessage(message!)
			setTimeout(() => {
				setShowError(false)
			}, 3000)
			return
		}

		// Sign in using NextAuth and redirect to page
		await signIn('credentials', { email, password })
	}

	return (
		<AuthLayout title={'register'}>
			<form onSubmit={handleSubmit(onRegisterUser)} noValidate>
				<Box sx={{ width: 350, padding: '10px 20px' }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant='h1' component='h1'>
								Crear cuenta
							</Typography>
							<Chip
								label='Algo salió mal'
								color='error'
								icon={<ErrorOutline />}
								className='fadeIn'
								sx={{ display: showError ? 'flex' : 'none' }}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								label='Nombre completo'
								variant='filled'
								fullWidth
								{...register('name', {
									required: 'Este campo es requerido',
									minLength: {
										value: nameMinChars,
										message: `Mínimo ${nameMinChars} caracteres`,
									},
								})}
								error={!!errors.name}
								helperText={errors.name?.message}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
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
								label='Contraseña'
								type='password'
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
								Registrar
							</Button>
						</Grid>

						<Grid item xs={12} display='flex' justifyContent={'end'}>
							<NextLink
								href={router.query.p ? `/auth/login?p=${router.query.p}` : '/auth/login'}
								passHref
							>
								<Link>¿Ya tienes una cuenta?</Link>
							</NextLink>
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

export default RegisterPage
