import axios from "axios";
import router from "../router";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    console.log("Axios response: ", response);
    return response;
  },
  (error) => {
    // console.log("Axios error: ", error);
    if (error.response && error.response.status === 401) {
      // console.log("This is redirect: ", error);
      router.navigate("/login");
      return error;
    }
    throw error;
  },
);

export default axiosClient;
