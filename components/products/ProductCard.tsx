import { Grid, Card, CardActionArea, CardMedia, Box, Typography, Link, Chip, CardContent, Paper } from '@mui/material'
import NextLink from 'next/link'
import React, { FC, useMemo, useState } from 'react'
import { IProduct } from '../../interfaces'

/**
 * Contract for component props
 */
interface Props {
	product: IProduct
}

/**
 * Component for showing a single product
 * @param param0 object implementing Props interface
 * @returns component layout in html
 */
export const ProductCard: FC<Props> = ({ product }) => {
	// Creates state for mouse hover action
	const [isHovered, setIsHovered] = useState(false)
	const [isImageLoaded, setisImageLoaded] = useState(false)

	// Optimizes image changing dependant on state by memoizing it
	const productImage = useMemo(() => {
		return isHovered ? `/products/${product.images[1]}` : `/products/${product.images[0]}`
	}, [isHovered, product.images])

	return (
		<Grid item xs={6} sm={4} key={product.slug}>
			<Paper>
				<NextLink href={`/product/${product.slug}`} passHref prefetch={false}>
					<Link>
						<CardActionArea
							onMouseEnter={() => setIsHovered(true)}
							onMouseLeave={() => setIsHovered(false)}
						>
							{product.inStock === 0 && (
								<Chip
									color='warning'
									label='No hay disponibles'
									sx={{
										position: 'absolute',
										zIndex: 99,
										top: '10px',
										left: '10px',
									}}
								/>
							)}

							<CardMedia
								component='img'
								className='fadeIn'
								image={productImage}
								alt={product.title}
								onLoad={() => setisImageLoaded(true)}
							/>
						</CardActionArea>
					</Link>
				</NextLink>
				<CardContent sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }} className='fadeIn'>
					<Typography fontWeight={700}>{product.title}</Typography>
					<Typography fontWeight={500}>{product.price} €</Typography>
				</CardContent>
			</Paper>
		</Grid>
	)
}
