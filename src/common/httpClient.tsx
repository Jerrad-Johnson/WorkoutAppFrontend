import axios from "axios";
export const durationToTimeout: number = 10000;
const cc = console.log;

const httpClient = axios.create();
httpClient.defaults.timeout = durationToTimeout;
httpClient.defaults.withCredentials = true;
httpClient.defaults.baseURL = "http://localhost:80/php/";

export default httpClient;