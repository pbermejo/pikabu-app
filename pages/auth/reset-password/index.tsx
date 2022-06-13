import { useState } from 'react'
import { useRouter } from 'next/router'

import { Box, Button, Grid, TextField, Typography, Chip } from '@mui/material'
import { CheckOutlined, ErrorOutline } from '@mui/icons-material'
import { useForm } from 'react-hook-form'

import { validations } from '../../../utils'
import { pikabuApi } from 'api'
import { AuthLayout } from '@/components/layouts'

/**
 * Contract for form data
 */
type FormData = {
	email: string
}

/**
 * Page component for reset password
 * @returns component layout in html
 */
const RequestPasswordResetPage = () => {
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
	const [errorMessage, setErrorMessage] = useState('No se reconoce el usurio')
	const [operationComplete, setOperationComplete] = useState(false)

	/**
	 * Method for handling reset password event
	 * @param param0 data from form
	 */
	const onRequestResetPassword = async ({ email }: FormData) => {
		setShowError(false)

		try {
			const { data } = await pikabuApi.post('/user/reset-password', { email })
			const { user, hash } = data
			setOperationComplete(true)
			await pikabuApi.post('/email', { email: user.email, hash: hash._id })
		} catch (error) {
			setShowError(true)
			setErrorMessage('Ha habido un error')
			setTimeout(() => {
				setShowError(false)
			}, 3000)
		}
	}

	return (
		<AuthLayout title={'Reset password'}>
			<form onSubmit={handleSubmit(onRequestResetPassword)} noValidate>
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
						{operationComplete ? (
							<Chip
								label='Se ha enviado un correo'
								color='success'
								icon={<CheckOutlined />}
								className='fadeIn'
							/>
						) : (
							<>
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
									<Button
										type='submit'
										color='secondary'
										className='circular-btn'
										size='large'
										fullWidth
									>
										Entrar
									</Button>
								</Grid>
							</>
						)}
					</Grid>
				</Box>
			</form>
		</AuthLayout>
	)
}

export default RequestPasswordResetPage
