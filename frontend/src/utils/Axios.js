import axios from "axios";

export const Axios = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});
