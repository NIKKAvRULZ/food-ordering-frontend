import axios from 'axios';
import type {
  Payment,
  PaymentWithDetails,
  CreatePaymentPayload,
  RefundPayload,
} from '../types/payment';

const BASE_URL = `${import.meta.env.VITE_PAYMENT_URL}/api/payments`;

// Reuse JWT interceptor already registered in api.ts (axios global)

export const getAllPayments = () =>
  axios.get<Payment[]>(BASE_URL);

export const getPaymentById = (id: string) =>
  axios.get<PaymentWithDetails>(`${BASE_URL}/${id}`);

export const getPaymentByOrderId = (orderId: string) =>
  axios.get<PaymentWithDetails>(`${BASE_URL}/order/${orderId}`);

export const getPaymentWithDetails = (id: string) =>
  axios.get<PaymentWithDetails>(`${BASE_URL}/${id}/details`);

export const createPaymentFromOrder = (orderId: string, userId: string) =>
  axios.post<Payment>(`${BASE_URL}/order/${orderId}/user/${userId}`);

export const createPayment = (payload: CreatePaymentPayload) =>
  axios.post<Payment>(BASE_URL, payload);

export const confirmPayment = (id: string) =>
  axios.post<Payment>(`${BASE_URL}/${id}/confirm`);

export const refundPayment = (id: string, payload: RefundPayload) =>
  axios.post<Payment>(`${BASE_URL}/${id}/refund`, payload);

export const getPaymentsByUser = (userId: string) =>
  axios.get<Payment[]>(`${BASE_URL}/user/${userId}`);

export const getInvoice = (id: string) =>
  axios.get<PaymentWithDetails>(`${BASE_URL}/${id}/invoice`);
