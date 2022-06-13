import { useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'

import { Box, Button, Grid, TextField, Typography, Chip } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { AuthLayout } from '@/components/layouts'
import { dbUsers } from 'database'
import { pikabuApi } from 'api'
import { IActivationHash } from 'interfaces'
import { useRouter } from 'next/router'

/**
 * Contract for form data
 */
type FormData = {
	password: string
}

interface Props {
	activationHash: IActivationHash
}

/**
 * Page component for login
 * @returns component layout in html
 */
const ResetPasswordPage: NextPage<Props> = ({ activationHash }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>()

	const passwordMinChars = Number(process.env.USER_PASSWORD_MIN_CHARS) || 6

	/**
	 * Show error state handler
	 */
	const [showError, setShowError] = useState(false)
	const [errorMessage, setErrorMessage] = useState('No se reconoce el usurio')
	const router = useRouter()

	/**
	 * Method for handling reset password event
	 * @param param0 data from form
	 */
	const onResetPassword = async ({ password }: FormData) => {
		// Update user with the new password
		try {
			await pikabuApi.post(`/user/${activationHash.userId}`, { password })
		} catch (error) {
			setShowError(true)
			setErrorMessage(error.response?.data.message as string)
			setTimeout(() => {
				setShowError(false)
			}, 3000)
		}

		// Delete activation hash
		try {
			await pikabuApi.delete(`/activationHash/${activationHash._id}`)
		} catch (error) {
			console.log(error.response?.data.message as string)
		}

		dbUsers.resetPassword('asdfasdf', 'asdfasd')
		// Redirect to login
		router.replace(`/auth/login`)
	}

	return (
		<AuthLayout title={'Reset password'}>
			<form onSubmit={handleSubmit(onResetPassword)} noValidate>
				<Box sx={{ width: 350, padding: '10px 20px' }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant='h1' component='h1'>
								Recuperar contraseña
							</Typography>
							<Chip
								label={errorMessage}
								color='error'
								icon={<ErrorOutline />}
								className='fadeIn'
								sx={{ display: showError ? 'flex' : 'none' }}
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
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const { email, hash } = query

	// Check email, hash in db

	if (!email || !hash) {
		return {
			redirect: {
				destination: `/`,
				permanent: false,
			},
		}
	}

	const user = await dbUsers.checkUserEmail(email as string)
	const activationHash = await dbUsers.checkActivationHash(hash as string)

	if (!user || !activationHash) {
		console.log('!user || !activationHash')
		return {
			redirect: {
				destination: `/`,
				permanent: false,
			},
		}
	}

	console.log(user._id.valueOf(), activationHash.userId)
	if (user._id.valueOf() !== activationHash.userId) {
		return {
			redirect: {
				destination: `/`,
				permanent: false,
			},
		}
	}

	return {
		props: {
			activationHash: JSON.parse(JSON.stringify(activationHash)),
		},
	}
}

export default ResetPasswordPage
