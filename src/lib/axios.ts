import axios from "axios";

const axiosInstance = axios.create({
  // By leaving this empty, Axios will automatically use the relative path
  // (hitting your Next.js mock routes on localhost:3000 instead of 8081)
  baseURL: "",
});

export default axiosInstance;
