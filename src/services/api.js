import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.7:4000",
  withCredentials: true,
});

export const openApi = axios.create({
  baseURL: "http://192.168.1.7:4000"
});

export default api;
