import axios from 'axios';
import type {
  Payment,
  PaymentWithDetails,
  CreatePaymentPayload,
  ConfirmPaymentPayload,
  RefundPayload,
} from '../types/payment';

const isDev = import.meta.env.DEV;
const paymentOrigin = import.meta.env.VITE_PAYMENT_URL || 'https://food-payment.onrender.com';
const BASE_URL = isDev
  ? `/proxy/payment/api/payments`
  : `${paymentOrigin}/api/payments`;

// Axios JWT interceptor is already attached in api.ts (axios global)

// ── Create a payment record & Stripe PaymentIntent ──────────────────────────
export const createPayment = (payload: CreatePaymentPayload) =>
  axios.post<{
    success: boolean;
    data: { paymentId: string; clientSecret: string; stripePaymentIntentId: string; status: string; amount: number; currency: string };
  }>(BASE_URL, payload);

// Inter-service shortcut: creates payment from live Order + User data
export const createPaymentFromOrder = (orderId: string, userId: string, body?: Partial<CreatePaymentPayload>) =>
  axios.post<{
    success: boolean;
    data: { paymentId: string; clientSecret: string; stripePaymentIntentId: string; status: string; amount: number; currency: string };
  }>(`${BASE_URL}/order/${orderId}/user/${userId}`, body ?? {});

// ── Confirm a payment (server-side Stripe confirm with PM id) ────────────────
export const confirmPayment = (id: string, payload: ConfirmPaymentPayload) =>
  axios.post<{ success: boolean; data: Payment }>(`${BASE_URL}/${id}/confirm`, payload);

// ── Refund a prior succeeded payment ────────────────────────────────────────
export const refundPayment = (id: string, payload: RefundPayload) =>
  axios.post<{ success: boolean; data: Payment }>(`${BASE_URL}/${id}/refund`, payload);

// ── Read endpoints ────────────────────────────────────────────────────────────
export const getAllPayments = (params?: { status?: string; page?: number; limit?: number }) =>
  axios.get<{ success: boolean; data: Payment[]; pagination: any }>(BASE_URL, { params });

export const getPaymentById = (id: string) =>
  axios.get<{ success: boolean; data: Payment }>(`${BASE_URL}/${id}`);

export const getPaymentWithDetails = (id: string) =>
  axios.get<{ success: boolean; data: PaymentWithDetails }>(`${BASE_URL}/${id}/details`);

export const getPaymentByOrderId = (orderId: string) =>
  axios.get<{ success: boolean; data: Payment }>(`${BASE_URL}/order/${orderId}`);

export const getPaymentsByUser = (userId: string, params?: { page?: number; limit?: number }) =>
  axios.get<{ success: boolean; data: { user: any; payments: Payment[] }; pagination: any }>(
    `${BASE_URL}/user/${userId}`,
    { params }
  );

export const getInvoice = (id: string) =>
  axios.get<{ success: boolean; data: PaymentWithDetails }>(`${BASE_URL}/${id}/invoice`);

