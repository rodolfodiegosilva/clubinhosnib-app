// src/config/axiosConfig.ts
import axios from "axios";

// Carrega a URL base da API a partir de variável de ambiente
// Se não estiver definida, usa "/api" como fallback
const baseURL = process.env.REACT_APP_API_URL || "/api";

// Cria uma instância do axios com a URL base
const apiAxios = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de requisição para adicionar o token de autenticação
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

// Interceptor de resposta para lidar com erros
apiAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redireciona para a página de login se não estiver autenticado
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiAxios;
