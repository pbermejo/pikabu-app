import NextLink from 'next/link'
import { AddOutlined, CategoryOutlined, DeleteOutlined } from '@mui/icons-material'
import { Box, Button, CardMedia, Grid, IconButton, Link } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import useSWR from 'swr'

import { AdminLayout } from '../../components/layouts'
import { IProduct } from '../../interfaces'
import { useEffect, useState } from 'react'
import { pikabuApi } from '../../api'

const ProductsPage = () => {
	const { data, error } = useSWR<IProduct[]>('/api/admin/products')

	const [products, setProducts] = useState<IProduct[]>([])

	useEffect(() => {
		if (data) {
			setProducts(data)
		}
	}, [data])

	if (!data && !error) return <></>

	const onDeleteProduct = async (productId: string) => {
		// Delete from collection
		const updatedProducts = products.filter(product => {
			return product._id !== productId
		})

		setProducts(updatedProducts)
		console.log('to delete', productId)
		const payload = {}

		// Delete from db
		try {
			await pikabuApi.delete(`/admin/products/${productId}`)
		} catch (error) {
			setProducts(products)
			console.log(error)
			alert('No se pudo borrar el producto')
		}
	}
	const columns: GridColDef[] = [
		{
			field: 'img',
			headerName: 'Foto',
			renderCell: ({ row }: GridValueGetterParams) => {
				return (
					<a href={`/product/${row.slug}`} target='_blank' rel='noreferrer'>
						<CardMedia component='img' alt={row.title} className='fadeIn' image={row.img} />
					</a>
				)
			},
		},
		{
			field: 'title',
			headerName: 'Title',
			width: 250,
			renderCell: ({ row }: GridValueGetterParams) => {
				return (
					<NextLink href={`/admin/products/${row.slug}`} passHref>
						<Link underline='always'>{row.title}</Link>
					</NextLink>
				)
			},
		},
		{ field: 'gender', headerName: 'Género' },
		{ field: 'type', headerName: 'Tipo' },
		{ field: 'inStock', headerName: 'Inventario' },
		{ field: 'price', headerName: 'Precio €' },
		{ field: 'sizes', headerName: 'Tallas', width: 250 },
		{
			field: 'delete',
			headerName: 'Borrar',
			renderCell: ({ row }: GridValueGetterParams) => {
				return (
					<IconButton color='error' onClick={() => onDeleteProduct(row.id)}>
						<DeleteOutlined />
					</IconButton>
				)
			},
		},
	]

	const rows = products!.map(product => ({
		id: product._id,
		img: product.images[0],
		title: product.title,
		gender: product.gender,
		type: product.type,
		inStock: product.inStock,
		price: product.price,
		sizes: product.sizes.join(', '),
		slug: product.slug,
	}))

	return (
		<AdminLayout
			title={`Productos (${data?.length})`}
			subTitle={'Mantenimiento de productos'}
			icon={<CategoryOutlined />}
		>
			<Box display='flex' justifyContent='end' sx={{ mb: 2 }}>
				<Button startIcon={<AddOutlined />} color='secondary' href='/admin/products/new'>
					Crear producto
				</Button>
			</Box>

			<Grid container className='fadeIn'>
				<Grid item xs={12} sx={{ height: 650, width: '100%' }}>
					<DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
				</Grid>
			</Grid>
		</AdminLayout>
	)
}

export default ProductsPage
