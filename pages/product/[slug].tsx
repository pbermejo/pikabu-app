import React, { useState } from 'react'
import { useContext } from 'react'

import { NextPage } from 'next'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'

import { Box, Button, Chip, Grid, Typography } from '@mui/material'

import { ShopLayout } from '../../components/layouts'
import { ProductSlideshow, SizeSelector } from '../../components/products'
import { ItemCounter } from '../../components/ui'
import { IProduct, ICartProduct, ISize } from '../../interfaces'
import { dbProducts } from '../../database'
import { CartContext } from '../../context'

/**
 * Contract for component props
 */
interface Props {
	product: IProduct
}

/**
 * Page component for cart
 * @param param0: object implementing Props interface
 * @returns component layout in html
 */
const ProductPage: NextPage<Props> = ({ product }) => {
	// const router = useRouter()
	// const {products:product, isLoading} = useProducts<IProduct>(`/products/${router.query.slug}`)

	const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
		_id: product._id,
		image: product.images[0],
		price: product.price,
		size: undefined,
		slug: product.slug,
		title: product.title,
		gender: product.gender,
		quantity: 1,
	})

	const { addProductToCart } = useContext(CartContext)
	const router = useRouter()

	/**
	 * Method for handling size selection event
	 * Sets size on current product by changing its state
	 * @param size ISize
	 * @returns void
	 */
	const onSelectedSize = (size: ISize) => {
		setTempCartProduct(currentProduct => ({
			...currentProduct,
			size,
		}))
	}

	/**
	 * Method for handling quantity selection event
	 * Sets quantity on current product by changing its state
	 * @param quantity number
	 * @returns void
	 */
	const onUpdateQuantity = (quantity: number) => {
		setTempCartProduct(currentProduct => ({
			...currentProduct,
			quantity,
		}))
	}

	/**
	 * Method for handling product addition event
	 * Navigates to cart page when a product is added
	 * @returns void
	 */
	const onAddProduct = () => {
		if (!tempCartProduct.size) return

		addProductToCart(tempCartProduct)
		router.push('/cart')
	}

	/**
	 * Component Layout
	 */
	return (
		<ShopLayout title={product.title} pageDescription={product.description}>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={7}>
					<ProductSlideshow images={product.images} />
				</Grid>

				<Grid item xs={12} sm={5}>
					<Box display='flex' flexDirection='column'>
						{/* Titles */}
						<Typography variant='h1' component='h1'>
							{product.title}
						</Typography>
						<Typography variant='subtitle1' component='h2'>
							{product.price}€
						</Typography>

						{/* Sizes */}
						<Box sx={{ my: 2 }}>
							<Typography variant='subtitle2'>Tallas disponibles</Typography>
							<SizeSelector
								selectedSize={tempCartProduct.size}
								sizes={product.sizes}
								onSelectedSize={onSelectedSize}
							/>
						</Box>

						{/* Amount */}
						<Box sx={{ my: 2 }}>
							<Typography variant='subtitle2'>Cantidad</Typography>
							<ItemCounter
								currentValue={tempCartProduct.quantity}
								onUpdateValue={onUpdateQuantity}
								maxValue={product.inStock > 5 ? 5 : product.inStock}
							/>
						</Box>

						{product.inStock > 0 ? (
							<Button color='primary' className='circular-btn' size='large' onClick={onAddProduct}>
								{tempCartProduct.size ? 'Añadir a la cesta' : 'Selecciona una talla'}
							</Button>
						) : (
							<Chip color='error' label='No hay disponibles' variant='outlined' size='medium' />
						)}

						{/* <Chip label='No disponible' color='error' variant='outlined'/> */}

						<Box sx={{ mt: 3 }}>
							<Typography variant='subtitle2'>Descripción</Typography>
							<Typography variant='body2'>{product.description}</Typography>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ShopLayout>
	)
}

// Classic request
// Only executes at server when client requests url to server
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {

//   const { slug } = params as { slug: string };
//   const product = await dbProducts.getProductBySlug(slug)

//   if (!product) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: {
//       product
//     }
//   }
// }

/**
 * Method for generating static paths for files [slug].html
 * @param ctx the app context
 * @returns object GetStaticPaths
 */
export const getStaticPaths: GetStaticPaths = async ctx => {
	const productSlugs = await dbProducts.getAllProductsSlug()

	return {
		paths: productSlugs.map(({ slug }) => ({
			params: { slug },
		})),
		fallback: 'blocking',
	}
}

/**
 * Method for providing props to [slug].tsx to generate [slug].html content
 * @param params ParsedURLQuery
 * @returns object GetStaticProps
 */
export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { slug = '' } = params as { slug: string }
	const product = await dbProducts.getProductBySlug(slug)

	if (!product) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}

	return {
		props: {
			product,
		},
		revalidate: 86400, // 60 sec * 60 min * 24 hours for Incremental Static Regeneration (ISR)
	}
}

export default ProductPage
