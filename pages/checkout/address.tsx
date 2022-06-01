import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, Button, FormControl, Grid, MenuItem, TextField, Typography } from '@mui/material'

import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form'

import { ShopLayout } from '../../components/layouts'
import { CartContext } from '../../context'
import { countries } from '../../database'

/**
 * Contract for form data
 */
type FormData = {
	address: string
	address2?: string
	city: string
	country: string
	firstName: string
	lastName: string
	phone: string
	zip: string
}

const getAddressFromCookies = (): FormData => {
	return {
		address: Cookies.get('address') || '',
		address2: Cookies.get('address2') || '',
		city: Cookies.get('city') || '',
		country: Cookies.get('country') || '',
		firstName: Cookies.get('firstName') || '',
		lastName: Cookies.get('lastName') || '',
		phone: Cookies.get('phone') || '',
		zip: Cookies.get('zip') || '',
	}
}

/**
 * Page component for checkout address
 * @returns component layout in html
 */
const AddressPage = () => {
	const DEFAULT_COUNTRY_CODE = Cookies.get('country') || process.env.NEXT_PUBLIC_COUNTRY_CODE || 'ESP'
	const router = useRouter()
	const { updateAddress } = useContext(CartContext)
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormData>({
		defaultValues: {
			address: '',
			address2: '',
			city: '',
			country: countries[0].code,
			firstName: '',
			lastName: '',
			phone: '',
			zip: '',
		},
	})

	useEffect(() => {
		reset(getAddressFromCookies())
	}, [reset])

	/**
	 * Method for handling submit event.
	 * Saves data on cookies and navigates to checkout summary
	 * @param data data from form
	 */
	const onSubmitAddress = (data: FormData) => {
		updateAddress(data)

		router.push('/checkout/summary')
	}

	return (
		<ShopLayout title={'Checkout'} pageDescription={'Confirmar dirección del destino'}>
			<Typography variant='h1' component='h1'>
				Dirección
			</Typography>

			<form onSubmit={handleSubmit(onSubmitAddress)} noValidate>
				<Grid container spacing={2} sx={{ mt: 2 }}>
					<Grid item xs={12} sm={6}>
						<TextField
							label='Nombre'
							variant='filled'
							fullWidth
							{...register('firstName', {
								required: 'Este campo es requerido',
							})}
							error={!!errors.firstName}
							helperText={errors.firstName?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label='Apellido'
							variant='filled'
							fullWidth
							{...register('lastName', {
								required: 'Este campo es requerido',
							})}
							error={!!errors.lastName}
							helperText={errors.lastName?.message}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField
							label='Dirección'
							variant='filled'
							fullWidth
							{...register('address', {
								required: 'Este campo es requerido',
							})}
							error={!!errors.address}
							helperText={errors.address?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label='Dirección 2 (opcional)'
							variant='filled'
							fullWidth
							{...register('address2')}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField
							label='Código Postal'
							variant='filled'
							fullWidth
							{...register('zip', {
								required: 'Este campo es requerido',
							})}
							error={!!errors.zip}
							helperText={errors.zip?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label='Ciudad'
							variant='filled'
							fullWidth
							{...register('city', {
								required: 'Este campo es requerido',
							})}
							error={!!errors.city}
							helperText={errors.city?.message}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<FormControl fullWidth>
							<TextField
								select
								variant='filled'
								key={DEFAULT_COUNTRY_CODE}
								label='País'
								defaultValue={DEFAULT_COUNTRY_CODE}
								{...register('country', {
									required: 'Este campo es requerido',
								})}
								error={!!errors.country}
								// helperText={errors.country?.message}
							>
								{countries.map(country => (
									<MenuItem key={country.code} value={country.code}>
										{country.name}
									</MenuItem>
								))}
							</TextField>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label='Teléfono'
							variant='filled'
							fullWidth
							{...register('phone', {
								required: 'Este campo es requerido',
							})}
							error={!!errors.phone}
							helperText={errors.phone?.message}
						/>
					</Grid>
				</Grid>

				<Box sx={{ mt: 5 }} display={'flex'} justifyContent={'center'}>
					<Button color={'secondary'} className={'circular-btn'} size={'large'} type='submit'>
						Revisar pedido
					</Button>
				</Box>
			</form>
		</ShopLayout>
	)
}

export default AddressPage
