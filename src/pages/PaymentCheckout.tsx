import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';
import { createPayment } from '../services/paymentApi';
import type { OrderInfo } from '../types/payment';
import axios from 'axios';

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

// ---------- inner form ----------
const CheckoutForm: React.FC<{ orderId: string; orderInfo: OrderInfo; onSuccess: (paymentId: string) => void }> = ({
  orderId,
  orderInfo,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    const card = elements.getElement(CardElement);
    if (!card) return;

    // 1. Create Stripe payment method
    const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (stripeError || !paymentMethod) {
      setError(stripeError?.message || 'Card error. Please try again.');
      setProcessing(false);
      return;
    }

    try {
      // 2. Send to backend
      const res = await createPayment({
        orderId,
        userId: user?.id?.toString() || orderInfo.userId,
        amount: orderInfo.price * orderInfo.quantity,
        currency: 'usd',
        paymentMethodId: paymentMethod.id,
      });
      onSuccess(res.data._id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        color: '#f8fafc',
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: '16px',
        '::placeholder': { color: '#64748b' },
      },
      invalid: { color: '#ef4444' },
    },
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Order Summary */}
      <div style={{
        background: 'rgba(212, 175, 55, 0.06)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '16px',
        padding: '20px',
      }}>
        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '12px' }}>
          Order Summary
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem' }}>
          <div><span style={{ color: 'var(--text-dim)' }}>Order Concept</span></div>
          <div style={{ textAlign: 'right', fontWeight: 600 }}>{orderInfo.product ? 'Legacy Entity' : 'Consolidated Cart'}</div>
          <div><span style={{ color: 'var(--text-dim)' }}>Reference</span></div>
          <div style={{ textAlign: 'right' }}>{orderInfo.product || 'Multi-Item Specification'}</div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Total Amount</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
            ${Number(orderInfo.price || (orderInfo as any).totalAmount || (orderInfo.price * orderInfo.quantity) || 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Card Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)' }}>
          Card Details
        </label>
        <div style={{
          padding: '14px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid var(--glass-border)',
          borderRadius: '14px',
        }}>
          <CardElement options={cardStyle} />
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', margin: '4px 0 0 0' }}>
          🔒 Secured by Stripe — use test card{' '}
          <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>4242 4242 4242 4242</span>
        </p>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '12px',
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid #ef4444',
          color: '#ef4444',
          fontSize: '0.85rem',
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn-gold"
        disabled={processing || !stripe}
        style={{ padding: '15px', fontSize: '1rem', letterSpacing: '0.5px' }}
      >
        {processing ? 'Processing Payment...' : `Pay $${((orderInfo.price || 0) * (orderInfo.quantity || 1)).toFixed(2)}`}
      </button>
    </form>
  );
};

// ---------- main page ----------
const PaymentCheckout: React.FC = () => {
  const { orderId: routeOrderId } = useParams<{ orderId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Steps: 'input' | 'confirm' | 'success'
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>(routeOrderId ? 'confirm' : 'input');
  const [orderId, setOrderId] = useState(routeOrderId || '');
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [successPaymentId, setSuccessPaymentId] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [fetching, setFetching] = useState(false);

  // Auto-fetch when orderId comes from URL
  useEffect(() => {
    if (routeOrderId) fetchOrder(routeOrderId);
  }, [routeOrderId]);

  const fetchOrder = async (id: string) => {
    setFetching(true);
    setFetchError('');
    try {
      const isDev = import.meta.env.DEV;
      const orderUrl = isDev ? `/proxy/order` : import.meta.env.VITE_ORDER_URL;
      const res = await axios.get<OrderInfo>(
        `${orderUrl}/orders/${id}`
      );
      setOrderInfo(res.data);
      setStep('confirm');
    } catch {
      setFetchError('Order not found. Please check the Order ID.');
    } finally {
      setFetching(false);
    }
  };

  const handleOrderIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) fetchOrder(orderId.trim());
  };

  const handleSuccess = (paymentId: string) => {
    setSuccessPaymentId(paymentId);
    setStep('success');
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)' }}>
        <div className="glass-panel" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-dim)' }}>Please log in to proceed with payment.</p>
          <button className="btn-gold" onClick={() => navigate('/login')} style={{ marginTop: '16px' }}>Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '40px 20px', minHeight: 'calc(100vh - 100px)' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>

        {/* Progress Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', justifyContent: 'center' }}>
          {['Order ID', 'Payment', 'Confirmed'].map((label, i) => {
            const stepIndex = step === 'input' ? 0 : step === 'confirm' ? 1 : 2;
            const isActive = i === stepIndex;
            const isDone = i < stepIndex;
            return (
              <React.Fragment key={label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700,
                    background: isDone ? 'var(--accent-gold)' : isActive ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isDone || isActive ? 'var(--accent-gold)' : 'var(--glass-border)'}`,
                    color: isDone ? '#000' : isActive ? 'var(--accent-gold)' : 'var(--text-dim)',
                  }}>
                    {isDone ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: '0.7rem', letterSpacing: '0.5px', color: isActive ? 'var(--text-main)' : 'var(--text-dim)' }}>{label}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: '1px', background: isDone ? 'var(--accent-gold)' : 'var(--glass-border)', maxWidth: '40px' }} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step 1 — Enter Order ID */}
        {step === 'input' && (
          <div className="glass-panel" style={{ padding: '40px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 300, margin: '0 0 8px 0' }}>
              Secure <span style={{ color: 'var(--accent-gold)' }}>Checkout</span>
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '32px' }}>
              Enter your Order ID to proceed with payment.
            </p>
            <form onSubmit={handleOrderIdSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)' }}>Order ID</label>
                <input
                  type="text"
                  placeholder="e.g. 683a2bf4c8d4e1a2b3c4d5e6"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  required
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              {fetchError && (
                <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', fontSize: '0.85rem' }}>
                  {fetchError}
                </div>
              )}
              <button type="submit" className="btn-gold" style={{ padding: '14px' }} disabled={fetching}>
                {fetching ? 'Fetching Order...' : 'Continue →'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2 — Payment Form */}
        {step === 'confirm' && orderInfo && (
          <div className="glass-panel" style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 300, margin: '0 0 4px 0' }}>
                  Complete <span style={{ color: 'var(--accent-gold)' }}>Payment</span>
                </h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', margin: 0 }}>Order #{String(orderId).slice(-8).toUpperCase()}</p>
              </div>
              <button onClick={() => setStep('input')} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.8rem' }}>
                ← Back
              </button>
            </div>
            <Elements stripe={stripePromise}>
              <CheckoutForm orderId={orderId} orderInfo={orderInfo} onSuccess={handleSuccess} />
            </Elements>
          </div>
        )}

        {/* Step 3 — Success */}
        {step === 'success' && (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{
              width: '70px', height: '70px', borderRadius: '50%', margin: '0 auto 24px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid var(--success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem',
            }}>
              ✓
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 300, marginBottom: '8px' }}>
              Payment <span style={{ color: '#10b981' }}>Confirmed</span>
            </h2>
            <p style={{ color: 'var(--text-dim)', marginBottom: '32px', fontSize: '0.9rem' }}>
              Your transaction has been processed successfully.
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '32px' }}>
              Payment ID: <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>{successPaymentId}</span>
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                className="btn-gold"
                onClick={() => navigate(`/payments/${successPaymentId}`)}
                style={{ padding: '12px 24px' }}
              >
                View Receipt
              </button>
              <button
                onClick={() => navigate(`/payments/${successPaymentId}/invoice`)}
                style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: '#fff', padding: '12px 24px', borderRadius: '100px', cursor: 'pointer' }}
              >
                Download Invoice
              </button>
            </div>
            <button
              onClick={() => navigate('/payments')}
              style={{ marginTop: '16px', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
            >
              View all payments
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCheckout;
