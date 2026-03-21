import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_IDENTITY_URL}/api/users`;
const CATALOG_URL = import.meta.env.VITE_CATALOG_URL;
const NOTIFICATION_URL = import.meta.env.VITE_NOTIFICATION_URL;
const ORDER_URL = import.meta.env.VITE_ORDER_URL;
const PAYMENT_URL = import.meta.env.VITE_PAYMENT_URL;

// Intercept requests to add JWT Token Auth Header
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// User / Identity
export const registerUser = (userData: any) => axios.post(`${API_BASE_URL}/register`, userData);
export const loginUser = (credentials: any) => axios.post(`${API_BASE_URL}/login`, null, { params: credentials });
export const getUserProfile = (id: number | string) => axios.get(`${API_BASE_URL}/${id}`);
export const updateUserProfile = (id: number | string, data: any) => axios.put(`${API_BASE_URL}/${id}`, data);
export const getOrderStatus = (id: number | string) => axios.get(`${API_BASE_URL}/${id}/order-status`);
export const getUserOrders = (id: number | string) => axios.get(`${API_BASE_URL}/${id}/orders`);
export const getDeals = () => axios.get(`${API_BASE_URL}/deals`);
export const getAllUsers = () => axios.get(`${API_BASE_URL}`);
export const deleteUser = (id: string | number) => axios.delete(`${API_BASE_URL}/${id}`);

// Notification
export const triggerOrderEmail = (userId: string, orderId: string) =>
    axios.post(`${NOTIFICATION_URL}/api/v1/notify`, { userId, orderId, status: "PAID" });

export const triggerReceiptEmail = (userId: string, orderId: string) =>
    axios.get(`${NOTIFICATION_URL}/api/v1/notify/receipt/${userId}/${orderId}`);

export const triggerWelcomeEmail = (userId: string) =>
    axios.get(`${NOTIFICATION_URL}/api/v1/notify/welcome/${userId}`);

// Catalog / Menu
export const getCatalogStatus = () => axios.get(`${CATALOG_URL}/health`);
export const getMenuItems = () => axios.get(`${CATALOG_URL}/menu/items`);
export const getCategories = () => axios.get(`${CATALOG_URL}/menu/categories`);
export const createMenuItem = (data: any) => axios.post(`${CATALOG_URL}/menu/items`, data);
export const updateMenuItem = (id: string | number, data: any) => axios.put(`${CATALOG_URL}/menu/items/${id}`, data);
export const deleteMenuItem = (id: string | number) => axios.delete(`${CATALOG_URL}/menu/items/${id}`);

// NEW: Personalized menu
export const getPersonalizedMenu = (userId: string | number) =>
    axios.get(`${CATALOG_URL}/menu/personalized/${userId}`);

// NEW: Integration status
export const getMenuIntegrationStatus = () =>
    axios.get(`${CATALOG_URL}/menu/integrations/status`);

// Orders
export const getAllOrders = () => axios.get(`${ORDER_URL}/orders`);
export const deleteOrder = (id: string | number) => axios.delete(`${ORDER_URL}/orders/${id}`);

// Payments
export const getAllPayments = () => axios.get(`${PAYMENT_URL}/api/payments`);
export const refundPayment = (id: string | number) => axios.post(`${PAYMENT_URL}/api/payments/${id}/refund`);