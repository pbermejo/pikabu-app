import { useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'

import { PayPalButtons } from '@paypal/react-paypal-js'
import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Typography } from '@mui/material'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material'

import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'
import { dbOrders, countries } from '../../database'
import { IOrder } from '../../interfaces'
import pikabuApi from '../../api/pikabuApi'

export type OrderResponseBody = {
	id: string
	status: 'COMPLETED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'PAYER_ACTION_REQUIRED'
}

/**
 * Contract for page props
 */
interface Props {
	order: IOrder
}

/**
 * Page component for product orders
 * @returns component layout in html
 */
const OrderPage: NextPage<Props> = ({ order }) => {
	const { numberOfItems, total } = order.cartSummary
	const { firstName, lastName, address, address2 = '', zip, city, country, phone } = order.shippingAddress
	const router = useRouter()
	const [isPaying, setIsPaying] = useState(false)

	const onOrderCompleted = async (details: OrderResponseBody) => {
		if (details.status !== 'COMPLETED') {
			return alert('No hay pago en Paypal')
		}

		setIsPaying(true)

		try {
			const { data } = await pikabuApi.post(`/orders/pay`, {
				transactionId: details.id,
				orderId: order._id,
			})

			router.reload()
		} catch (error) {
			setIsPaying(false)
			console.log(error)
			alert('Error')
		}
	}

	return (
		<ShopLayout title={`pedido - ${order._id}`} pageDescription='Pedido'>
			<Typography variant='h1' component='h1'>
				Resumen del pedido - {order._id}
			</Typography>

			{order.isPaid ? (
				<Chip sx={{ my: 2 }} label='Pagado' variant='outlined' color='success' icon={<CreditScoreOutlined />} />
			) : (
				<Chip
					sx={{ my: 2 }}
					label='Pendiente de pago'
					variant='outlined'
					color='error'
					icon={<CreditCardOffOutlined />}
				/>
			)}

			<Grid container>
				<Grid item xs={12} sm={7}>
					<CartList editable={false} products={order.orderItems} />
				</Grid>

				<Grid item xs={12} sm={5}>
					<Card className='summary-card'>
						<CardContent>
							<Typography variant='h2'>
								Pedido ({`${numberOfItems} ${numberOfItems === 1 ? 'producto' : 'productos'}`})
							</Typography>
							<Divider sx={{ my: 1 }} />

							<Box display='flex' justifyContent={'space-between'}>
								<Typography variant='subtitle1'>Dirección de entrega</Typography>
							</Box>

							<Typography>
								{firstName} {lastName}
							</Typography>
							<Typography>
								{address}
								{address2 ? `, ${address2}` : ''}{' '}
							</Typography>
							<Typography>
								{zip}, {city}
							</Typography>
							<Typography>{countries.find(c => c.code === country)?.name}</Typography>
							<Typography>{phone}</Typography>

							<Divider sx={{ my: 1 }} />

							<OrderSummary summaryValues={order.cartSummary} />

							<Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
								<Box
									display='flex'
									justifyContent='center'
									className='fadeIn'
									sx={{ display: isPaying ? 'flex' : 'none' }}
								>
									<CircularProgress />
								</Box>

								<Box flexDirection='column' sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }}>
									{order.isPaid ? (
										<Chip
											sx={{ my: 2 }}
											label='Orden ya fue pagada'
											variant='outlined'
											color='success'
											icon={<CreditScoreOutlined />}
										/>
									) : (
										<PayPalButtons
											createOrder={(data, actions) => {
												return actions.order.create({
													purchase_units: [
														{
															amount: {
																value: `${total}`,
															},
														},
													],
												})
											}}
											onApprove={(data, actions) => {
												return actions.order!.capture().then(details => {
													onOrderCompleted(details)
												})
											}}
										/>
									)}
								</Box>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	)
}

/**
 * Server side method for defining page props
 * before rendering to send to client
 * @param param0 request params
 * @returns a Promise containing page props
 */
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
	const { id = '' } = query

	// TODO: Move to middleware
	const session: any = await getSession({ req })

	if (!session) {
		return {
			redirect: {
				destination: `/auth/login?p=/orders/${id}`,
				permanent: false,
			},
		}
	}

	const order = await dbOrders.getOrderById(id.toString())

	if (!order) {
		return {
			redirect: {
				destination: `/orders/history`,
				permanent: false,
			},
		}
	}

	if (order.user !== session.user._id) {
		return {
			redirect: {
				destination: `/orders/history`,
				permanent: false,
			},
		}
	}

	return {
		props: {
			order,
		},
	}
}

export default OrderPage
