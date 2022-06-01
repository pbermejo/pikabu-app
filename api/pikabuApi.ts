import axios from "axios";

const pikabuApi = axios.create({
	baseURL: "/api",
});

export default pikabuApi;
