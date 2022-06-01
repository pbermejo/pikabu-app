import { Divider, Grid, Typography } from '@mui/material'
import { FC, useContext } from 'react'
import { CartContext } from '../../context'
import { currency } from '../../utils'
import { ICartSummary } from '../../interfaces'

interface Props {
	summaryValues: ICartSummary
}

/**
 * Component for showing the order summary
 * @returns component layout in html
 */
export const OrderSummary: FC<Props> = ({ summaryValues }) => {
	const { summary } = useContext(CartContext)

	const { numberOfItems, subTotal, tax, total } = summaryValues ? summaryValues : summary

	return (
		<Grid container>
			<Grid item xs={6}>
				<Typography>No. Productos</Typography>
			</Grid>

			<Grid item xs={6} display='flex' justifyContent='end'>
				<Typography>{`${numberOfItems} ${numberOfItems == 1 ? 'producto' : 'productos'}`}</Typography>
			</Grid>

			<Grid item xs={6}>
				<Typography>Subtotal</Typography>
			</Grid>

			<Grid item xs={6} display='flex' justifyContent='end'>
				<Typography>{currency.format(subTotal)}</Typography>
			</Grid>

			<Grid item xs={6}>
				<Typography>Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</Typography>
			</Grid>

			<Grid item xs={6} display='flex' justifyContent='end'>
				<Typography>{currency.format(tax)}</Typography>
			</Grid>

			<Grid item xs={12} sx={{ my: 2 }}>
				<Divider />
			</Grid>

			<Grid item xs={6}>
				<Typography variant='subtitle1'>Total:</Typography>
			</Grid>

			<Grid item xs={6} display='flex' justifyContent='end'>
				<Typography variant='subtitle1'>{currency.format(total)}</Typography>
			</Grid>
		</Grid>
	)
}
