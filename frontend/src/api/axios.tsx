// src/api/axios.ts
import axios from 'axios';

const api = axios.create({
    // 'http://localhost' funciona porque Nginx mapea el puerto 80
    // Si tu backend corre en otro puerto, cámbialo aquí (ej. http://localhost:8000)
    baseURL: 'http://localhost/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor opcional para depuración
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;