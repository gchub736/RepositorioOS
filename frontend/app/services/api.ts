import axios from 'axios';

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
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