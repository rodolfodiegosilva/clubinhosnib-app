import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { store } from '../store/slices'; // ✅ necessário
import { logout, login } from '../store/slices/auth/authSlice'; // ✅ apenas actions

const baseURL = process.env.REACT_APP_API_URL ?? 'http://localhost:3000';

const apiAxios = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tipo com _retry para controlar duplicidade de requisições
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ✅ Interceptor de requisição
apiAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    console.log('[Axios][Request] Interceptando requisição para:', config.url);

    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('[Axios][Request] Token adicionado ao header');
    } else {
      console.log('[Axios][Request] Nenhum token encontrado');
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('[Axios][Request] Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// ✅ Interceptor de resposta com refresh automático
apiAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('[Axios][Response] Sucesso na resposta de:', response.config.url);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('[Axios][Response] Token expirado. Tentando refresh...');

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('Sem refreshToken');

        const response = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });

        const { accessToken, refreshToken: newRefresh } = response.data;

        // ✅ Atualiza Redux e localStorage com novos tokens
        store.dispatch(login({ accessToken, refreshToken: newRefresh }));

        // ✅ Atualiza o header da requisição original e reenviando
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        console.log('[Axios][Response] Token atualizado. Reenviando requisição...',originalRequest.headers['Authorization']);
        

        return apiAxios(originalRequest);
      } catch (refreshError) {
        console.error('[Axios][Response] Erro ao tentar refresh:', refreshError);
        store.dispatch(logout());
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiAxios;
