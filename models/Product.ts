import mongoose, { Schema, model, Model } from 'mongoose'
import { IProduct } from '../interfaces'

/**
 * Schema for creating product models on db
 */
const productSchema = new Schema(
	{
		description: { type: String, required: true },
		images: [{ type: String }],
		inStock: { type: Number, required: true, default: 0 },
		price: { type: Number, required: true, default: 0 },
		sizes: [
			{
				type: String,
				enum: {
					values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
					message: '{VALUE} no es un tamaño válido',
				},
			},
		],
		slug: { type: String, required: true, unique: true },
		tags: [{ type: String }],
		title: { type: String, required: true },
		type: {
			type: String,
			enum: {
				values: ['shirts', 'pants', 'hoodies', 'hats'],
				message: '{VALUE} no es una categoría válida',
			},
		},
		gender: {
			type: String,
			enum: {
				values: ['men', 'women', 'kids', 'unisex'],
				message: '{VALUE} no es un género válido',
			},
		},
	},
	{
		timestamps: true,
	}
)

/**
 * Creates an index for product schema
 * for making easy searches on some properties
 */
productSchema.index({ title: 'text', tags: 'text' })

/**
 * Model for products
 * The model is loaded from mongoose if exists.
 * OR a new one is created from schema
 */
const Product: Model<IProduct> = mongoose.models?.Product || model('Product', productSchema)

export default Product
