import axios from 'axios';
import { useRouter } from 'next/router';

export const baseURL = 'http://localhost:8000';

export const apiClient = axios.create({ baseURL });

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            localStorage.removeItem('token');
            const router = useRouter();
            router.push('/auth');
        }
        return Promise.reject(error);
    }
);