import mongoose, { Schema, model, Model } from 'mongoose'
import { IActivationHash } from '../interfaces'

/**
 * Schema for creating activationHash models on db
 */
const activationHashSchema = new Schema(
	{
		userId: { type: String, required: true },
	},
	{
		timestamps: true,
	}
)

/**
 * Model for activationHashes
 * The model is loaded from mongoose if exists.
 * OR a new one is created from schema
 */
const ActivationHash: Model<IActivationHash> =
	mongoose.models?.ActivationHash || model('ActivationHash', activationHashSchema)

export default ActivationHash
