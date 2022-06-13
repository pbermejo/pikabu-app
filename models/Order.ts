import mongoose, { Schema, model, Model } from 'mongoose'
import { IOrder } from '../interfaces'

/**
 * Schema for creating order models on db
 */
const orderSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		orderItems: [
			{
				_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
				gender: [
					{
						type: String,
						required: true,
						enum: {
							values: ['men', 'women', 'kids', 'unisex'],
							message: '{VALUE} is not a valid gender',
						},
					},
				],
				image: { type: String, required: true },
				price: { type: Number, required: true },
				quantity: { type: Number, required: true },
				size: [
					{
						type: String,
						required: true,
						enum: {
							values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
							message: '{VALUE} is not a valid size',
						},
					},
				],
				slug: { type: String, required: true },
				title: { type: String, required: true },
			},
		],
		shippingAddress: {
			address: { type: String, required: true },
			address2: { type: String },
			city: { type: String, required: true },
			country: { type: String, required: true },
			firstName: { type: String, required: true },
			lastName: { type: String, required: true },
			phone: { type: String, required: true },
			zip: { type: String, required: true },
		},
		cartSummary: {
			numberOfItems: { type: Number, required: true },
			subTotal: { type: Number, required: true },
			tax: { type: Number, required: true },
			total: { type: Number, required: true },
		},
		isPaid: { type: Boolean, required: true },
		paidAt: { type: String },

		transactionId: { type: String },
	},
	{
		timestamps: true,
	}
)

/**
 * Model for orders
 * The model is loaded from mongoose if exists.
 * OR a new one is created from schema
 */
const Order: Model<IOrder> = mongoose.models?.Order || model('Order', orderSchema)

export default Order
