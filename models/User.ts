import mongoose, { Schema, model, Model } from 'mongoose'
import { IUser } from '../interfaces'

/**
 * Schema for creating user models on db
 */
const userSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: {
			type: String,
			enum: {
				values: ['super-user', 'admin', 'client'],
				message: '{VALUE} is not a valid role',
				default: 'client',
				required: true,
			},
		},
	},
	{
		timestamps: true,
	}
)

/**
 * Model for users
 * The model is loaded from mongoose if exists.
 * OR a new one is created from schema
 */
const User: Model<IUser> = mongoose.models?.User || model('User', userSchema)

export default User
