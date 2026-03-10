export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
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
  refundId?: string;
  refundReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderInfo {
  id: string;
  userId: string;
  product: string;
  quantity: number;
  price: number;
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
  paymentMethodId: string;
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
