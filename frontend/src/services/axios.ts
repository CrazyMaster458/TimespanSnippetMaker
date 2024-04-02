import axios from "axios";
import router from "../router";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  // withCredentials: true,
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
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("TOKEN");
      localStorage.removeItem("USER");
      window.location.href = "/login";

      router.navigate("/login");
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
