import axios from 'axios';

const isDev = import.meta.env.DEV;
const API_BASE_URL = isDev ? `/proxy/identity/api/users` : `${import.meta.env.VITE_IDENTITY_URL}/api/users`;
const CATALOG_URL = isDev ? `/proxy/catalog` : import.meta.env.VITE_CATALOG_URL;
const NOTIFICATION_URL = isDev ? `/proxy/notification` : import.meta.env.VITE_NOTIFICATION_URL;

// Intercept requests to add JWT Token Auth Header
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const registerUser = (userData: any) => axios.post(`${API_BASE_URL}/register`, userData);
export const loginUser = (credentials: any) => axios.post(`${API_BASE_URL}/login`, null, { params: credentials });
export const getUserProfile = (id: number | string) => axios.get(`${API_BASE_URL}/${id}`);
export const getOrderStatus = (id: number | string) => axios.get(`${API_BASE_URL}/${id}/order-status`);
export const getUserOrders = (id: number | string) => axios.get(`${API_BASE_URL}/${id}/orders`);
export const getDeals = () => axios.get(`${API_BASE_URL}/deals`);

export const triggerOrderEmail = (userId: string) => axios.post(`${NOTIFICATION_URL}/api/v1/notify`, { userId, orderId: "1", status: "PAID" });

export const getCatalogStatus = () => axios.get(`${CATALOG_URL}/health`);