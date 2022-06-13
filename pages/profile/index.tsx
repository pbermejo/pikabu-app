import { useContext, useState } from 'react'
import { NextPage } from 'next'
import useSWR from 'swr'

import { useForm } from 'react-hook-form'
import { AccountCircleOutlined, ErrorOutline } from '@mui/icons-material'
import { Box, Button, Chip, Grid, Link, MenuItem, Select, TextField, Typography, FormControl } from '@mui/material'
import { AdminLayout } from '@/components/layouts'
import { IUser, IUserUpdate } from 'interfaces'
import { AuthContext } from 'context'
import { IRole } from '../../interfaces'
import { useRouter } from 'next/router'

/**
 * Contract for form data
 */
type FormData = {
	email: string
	name: string
	password: string
	role?: IRole
}

const UserProfilePage: NextPage = () => {
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

	/**
	 * Validation conditions
	 */
	const passwordMinChars = Number(process.env.USER_PASSWORD_MIN_CHARS) || 6
	const nameMinChars = Number(process.env.USER_NAME_MIN_CHARS) || 2

	const { user, updateUser, logout } = useContext(AuthContext)
	const router = useRouter()

	const { data, error } = useSWR<IUser>(`/api/user/${user?._id}`)

	if (!error && !data) {
		return <></>
	}

	if (error) {
		console.log(error)
		return <Typography>Error al cargar la información</Typography>
	}

	/**
	 * Method for handling register event
	 * Tries to register an user and navigate back to the page the user was
	 * OR shows an error message
	 * @param param0 data from form
	 * @returns a Promise
	 */
	const onUpdateUser = async ({ email, name, password, role }: FormData) => {
		setShowError(false)
		let updatedUser: IUserUpdate = { _id: user._id! }
		if (email) {
			updatedUser = { ...updatedUser, email }
		}
		if (name) {
			updatedUser = { ...updatedUser, name }
		}
		if (password) {
			updatedUser = { ...updatedUser, password }
		}
		if (role) {
			updatedUser = { ...updatedUser, role }
		}

		if (Object.entries(updatedUser).length === 1) {
			setShowError(true)
			setErrorMessage('No se ha modificado información')
			setTimeout(() => {
				setShowError(false)
			}, 3000)
			return
		}

		const { hasError, message } = await updateUser(updatedUser)

		if (hasError) {
			setShowError(true)
			setErrorMessage(message!)
			setTimeout(() => {
				setShowError(false)
			}, 3000)
			return
		}

		logout()
		router.replace('/auth/login')
	}

	return (
		<AdminLayout title='Perfil' subTitle='Perfil de usuario' icon={<AccountCircleOutlined />}>
			<form onSubmit={handleSubmit(onUpdateUser)} noValidate>
				<Box display='flex' justifyContent='center'>
					<Box sx={{ width: 350, padding: '10px 20px' }}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
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
									label={user?.name}
									variant='filled'
									fullWidth
									{...register('name', {
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
									label={user?.email}
									variant='filled'
									fullWidth
									{...register('email', {})}
									error={!!errors.email}
									helperText={errors.email?.message}
								/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									label='***********'
									type='password'
									variant='filled'
									fullWidth
									{...register('password', {
										minLength: {
											value: passwordMinChars,
											message: `Mínimo ${passwordMinChars} caracteres`,
										},
									})}
									error={!!errors.password}
									helperText={errors.password?.message}
								/>
							</Grid>
							{/* <Grid item xs={12}>
								<FormControl disabled={user?.role === 'client'}>
									<Select
										value={user?.role}
										label='Rol'
										{...register('role')}
										error={!!errors.role}
										// helperText={errors.role?.message}
									>
										<MenuItem value='admin' selected={user?.role === 'admin'}>
											Admin
										</MenuItem>
										<MenuItem value='client' selected={user?.role === 'client'}>
											Client
										</MenuItem>
									</Select>
								</FormControl>
							</Grid> */}

							<Grid item xs={12}>
								<Button type='submit' color='secondary' className='circular-btn' size='large' fullWidth>
									Guardar
								</Button>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</form>
		</AdminLayout>
	)
}

export default UserProfilePage
