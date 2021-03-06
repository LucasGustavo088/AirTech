import axios from "axios";
import { getToken } from "./auth";

const baseUrl = "http://ec2-18-237-49-206.us-west-2.compute.amazonaws.com/api/v1/";
const api = axios.create({
    baseURL: baseUrl
});

api.baseUrl = baseUrl;

api.interceptors.request.use(async config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;