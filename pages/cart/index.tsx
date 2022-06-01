import { useContext, useEffect } from 'react'
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material'

import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'
import { CartContext } from '../../context'
import { useRouter } from 'next/router'

/**
 * Page component for cart
 * @returns component layout in html
 */
const CartPage = () => {
	const { isLoaded, summary } = useContext(CartContext)
	const router = useRouter()

	useEffect(() => {
		if (isLoaded && summary.numberOfItems === 0) {
			router.replace('/cart/empty')
		}
	}, [isLoaded, summary, router])

	// Prevents Flash of Faux Text (FOFT)
	if (!isLoaded || summary.numberOfItems === 0) {
		return <></>
	}

	return (
		<ShopLayout title='Cesta - 3' pageDescription='Cesta de compra de la tienda'>
			<Typography variant='h1' component='h1'>
				Cesta
			</Typography>

			<Grid container>
				<Grid item xs={12} sm={7}>
					<CartList editable />
				</Grid>

				<Grid item xs={12} sm={5}>
					<Card className='summary-card'>
						<CardContent>
							<Typography variant='h2'>Pedido</Typography>
							<Divider sx={{ my: 1 }} />

							<OrderSummary />

							<Box sx={{ mt: 3 }}>
								<Button color='secondary' className='circular-btn' href='/checkout/address' fullWidth>
									Comprar
								</Button>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	)
}

export default CartPage
