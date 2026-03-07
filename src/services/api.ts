import axios from 'axios';

// Vite requires the 'VITE_' prefix to expose variables to your code
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CATALOG_URL = import.meta.env.VITE_CATALOG_URL;

export const registerUser = (userData: any) => axios.post(`${API_BASE_URL}/register`, userData);
export const loginUser = (credentials: any) => axios.post(`${API_BASE_URL}/login`, credentials);
export const getUserProfile = (id: number) => axios.get(`${API_BASE_URL}/${id}`);

export const getCatalogStatus = () => axios.get(CATALOG_URL);