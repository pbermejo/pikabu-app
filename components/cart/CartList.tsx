import { FC, useContext } from 'react'
import NextLink from 'next/link'

import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material'

import { ItemCounter } from '../ui'
import { CartContext } from '../../context'
import { ICartProduct, IOrderItem } from '../../interfaces'

/**
 * Contract for component props
 */
interface Props {
	editable?: boolean
	products?: IOrderItem[]
}

/**
 * Component for listing products in cart
 * @param param0 object implementing Props interface
 * @returns component layout in html
 */
export const CartList: FC<Props> = ({ editable = false, products }) => {
	/**
	 * Retrieves products from Cart context
	 */
	const { cart, updateCartQuantity, removeProductSizeFromCart } = useContext(CartContext)

	const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
		product.quantity = newQuantityValue
		updateCartQuantity(product)
	}

	const onRemoveProductSize = (product: ICartProduct) => {
		removeProductSizeFromCart(product)
	}

	const productsToShow = products ? products : cart

	return (
		<>
			{productsToShow.map(product => (
				// Key is modified for making product unique
				// when there are many sizes of the same product
				<Grid container spacing={2} key={product.slug + product.size} sx={{ mb: 1 }}>
					<Grid item xs={3}>
						<NextLink href={`/product/${product.slug}`} passHref>
							<Link>
								<CardActionArea>
									<CardMedia
										image={`/products/${product.image}`}
										component='img'
										sx={{ borderRadius: '5px' }}
									/>
								</CardActionArea>
							</Link>
						</NextLink>
					</Grid>
					<Grid item xs={7}>
						<Box display='flex' flexDirection='column'>
							<Typography variant='body1'>{product.title}</Typography>
							<Typography variant='body1'>
								Talla: <strong>{product.size}</strong>
							</Typography>

							{editable ? (
								<ItemCounter
									currentValue={product.quantity}
									maxValue={10}
									onUpdateValue={value => onNewCartQuantityValue(product as ICartProduct, value)}
								/>
							) : (
								<Typography variant='h6'>{`${product.quantity} ${
									product.quantity === 1 ? 'productos' : 'producto'
								}`}</Typography>
							)}
						</Box>
					</Grid>
					<Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
						<Typography variant='subtitle1'>{product.price} €</Typography>
						{editable && (
							<Button
								variant='text'
								color='primary'
								onClick={() => onRemoveProductSize(product as ICartProduct)}
							>
								Quitar
							</Button>
						)}
					</Grid>
				</Grid>
			))}
		</>
	)
}
