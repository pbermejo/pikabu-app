/**
 * Contract for defining a product
 */
export interface IProduct {
	_id: string
	description: string
	gender: IGender
	images: string[]
	inStock: number
	price: number
	sizes: ISize[]
	slug: string
	tags: string[]
	title: string
	type: IType

	// Añadido createdAt y updatedAt de mongo
	createdAt: string
	updatedAt: string
}

/**
 * Contract for defining product sizes
 */
export type ISize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL'

/**
 * Contract for defining product types
 */
export type IType = 'shirts' | 'pants' | 'hoodies' | 'hats'

/**
 * Contract for defining product gender
 */
export type IGender = 'men' | 'women' | 'kids' | 'unisex'
