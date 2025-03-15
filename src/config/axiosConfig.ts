import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

const apiAxios = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiAxios.interceptors.request.use(
  (config:any) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiAxios;
