import { NextPage, GetServerSideProps } from 'next'
import NextLink from 'next/link'
import { getSession } from 'next-auth/react'

import { Chip, Grid, Link, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams, GridToolbar } from '@mui/x-data-grid'

import { ShopLayout } from '../../components/layouts'
import { dbOrders } from '../../database'
import { IOrder } from '../../interfaces'

const columns: GridColDef[] = [
	{ field: 'id', headerName: 'ID', width: 100 },
	{ field: 'fullname', headerName: 'Nombre Completo', width: 300 },
	{
		field: 'paid',
		headerName: 'Pagada',
		description: 'Muestra información si está pagado el pedido',
		width: 200,
		renderCell: (params: GridValueGetterParams) => {
			return params.row.paid ? (
				<Chip color='success' label='Pagada' variant='outlined' />
			) : (
				<Chip color='error' label='No Pagada' variant='outlined' />
			)
		},
	},
	{
		field: 'pedido',
		headerName: 'Ver Pedido',
		description: 'Ver el detalle del pedido',
		width: 200,
		renderCell: (params: GridValueGetterParams) => {
			return (
				<NextLink href={`/orders/${params.row.orderId}`} passHref>
					<Link underline='always'>Ver pedido</Link>
				</NextLink>
			)
		},
	},
]

/**
 * Contract for component props
 */
interface Props {
	orders: IOrder[]
}

/**
 * Page component for order history
 * @returns component layout in html
 */
const HistoryPage: NextPage<Props> = ({ orders }) => {
	const rows = orders.map((order, idx) => ({
		id: idx + 1,
		paid: order.isPaid,
		fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
		orderId: order._id,
	}))

	return (
		<ShopLayout title={'Historial de pedidos'} pageDescription={'Historial de pedidos del cliente'}>
			<Typography variant='h1' component='h1'>
				Historial de pedidos
			</Typography>

			<Grid container>
				<Grid item xs={12} sx={{ height: 650, width: '100%' }}>
					<DataGrid
						columns={columns}
						rows={rows}
						pageSize={10}
						rowsPerPageOptions={[10]}
						components={{ Toolbar: GridToolbar }}
					/>
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
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session: any = await getSession({ req })

	if (!session) {
		return {
			redirect: {
				destination: '/auth/login?p=/orders/history',
				permanent: false,
			},
		}
	}

	const orders = await dbOrders.getOrdersByUser(session.user._id)

	return {
		props: {
			orders,
		},
	}
}

export default HistoryPage
