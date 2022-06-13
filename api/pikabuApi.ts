import axios from 'axios'

/**
 * Method for instantiating axios calls to API
 */
const pikabuApi = axios.create({
	baseURL: '/api',
})

export default pikabuApi
