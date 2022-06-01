import { Typography, Box } from '@mui/material'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { dbProducts } from '../../database'
import { IProduct } from '../../interfaces'

interface Props {
	products: IProduct[]
	foundProducts: boolean
	query: string
}

// SearchPage
const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
	//const { products, isLoading } = useProducts(`/search/${query}`)

	return (
		<ShopLayout title={'Pikabu Shop - Search'} pageDescription={'Encuentra los mejores productos de Pikabu'}>
			<Typography variant='h1' component='h1'>
				Buscar productos
			</Typography>

			{foundProducts ? (
				<Typography variant='h2' sx={{ mb: 1 }} textTransform='capitalize'>
					Término: {query}
				</Typography>
			) : (
				<Box display='flex'>
					<Typography variant='h2' sx={{ mb: 1 }}>
						No se han encontrado productos
					</Typography>
					<Typography variant='h2' sx={{ mb: 1, ml: 1 }} color='secondary' textTransform='capitalize'>
						{query}
					</Typography>
				</Box>
			)}

			<ProductList products={products} />
		</ShopLayout>
	)
}

/**
 * Server side method for defining page props
 * before rendering to send to client
 * @param param0 request params
 * @returns a Promise containing page props
 */
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const { query = '' } = params as { query: string }

	// Redirect to home when an error on query occurs
	if (query.length === 0) {
		return {
			redirect: {
				destination: '/',
				permanent: true,
			},
		}
	}

	let products = await dbProducts.getProductsByTerm(query)
	const foundProducts = products.length > 0

	// TODO: retornar otros productos si no existen productos
	if (!foundProducts) {
		products = await dbProducts.getAllProducts()
	}

	return {
		props: {
			products,
			foundProducts,
			query,
		},
	}
}

export default SearchPage
