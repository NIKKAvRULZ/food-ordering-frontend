// 'succeeded' is what the backend/Stripe returns; 'completed' is kept for backward compat
export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'completed' | 'failed' | 'refunded';
export type PaymentCurrency = 'usd' | 'eur' | 'gbp' | 'lkr';

export interface Payment {
  _id: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: PaymentCurrency;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  stripePaymentMethodId?: string;
  stripeClientSecret?: string;
  refundId?: string;
  refundReason?: string;
  refundAmount?: number;
  description?: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

// Supports both legacy (product/price/quantity) and modern (items/totalAmount) order shapes
export interface OrderInfo {
  id?: string;
  _id?: string;
  userId: string;
  product?: string;
  quantity?: number;
  price?: number;
  // Modern order service fields
  totalAmount?: number;
  totalPrice?: number;
  total?: number;
  items?: Array<{ name: string; quantity: number; price: number; menuItemId?: string }>;
  currency?: string;
  status: string;
}

export interface PaymentWithDetails extends Payment {
  orderDetails?: OrderInfo;
  userDetails?: {
    id: string;
    username: string;
    email: string;
    deliveryAddress?: string;
  };
}

export interface CreatePaymentPayload {
  orderId: string;
  userId: string;
  amount: number;
  currency: PaymentCurrency;
  paymentMethod?: string;   // payment type: "card"
  description?: string;
  metadata?: Record<string, string>;
}

export interface ConfirmPaymentPayload {
  paymentMethodId: string;  // Stripe PaymentMethod ID: pm_xxx
}

export interface RefundPayload {
  reason?: string;
}

export interface PaymentStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  refunded: number;
  totalRevenue: number;
}

/** Resolves the payable amount from any order shape */
export function resolveOrderAmount(order: OrderInfo): number {
  return (
    order.totalAmount ??
    order.totalPrice ??
    order.total ??
    ((order.price ?? 0) * (order.quantity ?? 1))
  );
}
