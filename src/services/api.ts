import axios from 'axios';

const API_BASE_URL = "https://user-identity-service.onrender.com/api/users";

export const registerUser = (userData: any) => axios.post(`${API_BASE_URL}/register`, userData);
export const loginUser = (credentials: any) => axios.post(`${API_BASE_URL}/login`, credentials);
export const getUserProfile = (id: number) => axios.get(`${API_BASE_URL}/${id}`);