import axios from 'axios';

// Base da API centralizada e configurável por ambiente (fallback para o dev local).
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {

    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {

      if (error.config.url?.includes('/login')) {
        return Promise.reject(error);
      }

      sessionStorage.removeItem('token');
      sessionStorage.removeItem('usuarioId');
      sessionStorage.removeItem('usuarioCargo');

      alert("Sua sessão expirou. Por segurança, por favor, faça login novamente para continuar.");

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;