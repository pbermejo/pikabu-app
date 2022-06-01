import mongoose from 'mongoose'

/**
 * MongoDB driver
 *
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
 */
const mongoConnection = {
	isConnected: 0,
}

/**
 * Method for connecting to the db
 * @returns a Promise with the db connection
 */
export const connect = async () => {
	if (mongoConnection.isConnected === 1) {
		console.log('Ya estamos conectados')
		return
	}

	if (mongoose.connections.length > 0) {
		mongoConnection.isConnected = mongoose.connections[0].readyState

		if (mongoConnection.isConnected === 1) {
			console.log('Usando conexión anterior')
			return
		}

		await mongoose.disconnect()
	}

	await mongoose.connect(process.env.MONGO_URL || '')
	mongoConnection.isConnected = 1
	console.log('Conectado a MongoDB: ', process.env.MONGO_URL)
}

/**
 * Method for disconnecting from the db
 * @returns a void Promise
 */
export const disconnect = async () => {
	if (process.env.NODE_ENV === 'development') return

	if (mongoConnection.isConnected === 0) return

	await mongoose.disconnect()
	mongoConnection.isConnected = 0

	console.log('Desconectado de MongoDB')
}
