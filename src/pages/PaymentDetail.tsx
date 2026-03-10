import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPaymentWithDetails, refundPayment } from '../services/paymentApi';
import type { PaymentWithDetails, PaymentStatus } from '../types/payment';

const STATUS_COLOR: Record<PaymentStatus, { bg: string; color: string; label: string }> = {
  completed: { bg: 'rgba(16,185,129,0.15)',  color: '#10b981', label: 'COMPLETED' },
  processing:{ bg: 'rgba(56,189,248,0.15)',  color: '#38bdf8', label: 'PROCESSING' },
  pending:   { bg: 'rgba(251,191,36,0.15)',   color: '#fbbf24', label: 'PENDING' },
  failed:    { bg: 'rgba(239,68,68,0.15)',    color: '#ef4444', label: 'FAILED' },
  refunded:  { bg: 'rgba(148,163,184,0.15)',  color: '#94a3b8', label: 'REFUNDED' },
};

type Tab = 'payment' | 'order' | 'timeline';

const PaymentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: _currentUser } = useAuth();

  const [payment, setPayment] = useState<PaymentWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('payment');

  // Refund modal
  const [showRefund, setShowRefund] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [refunding, setRefunding] = useState(false);
  const [refundError, setRefundError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getPaymentWithDetails(id);
        setPayment(res.data);
      } catch {
        setError('Payment record not found.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleRefund = async () => {
    if (!id) return;
    setRefunding(true);
    setRefundError('');
    try {
      const res = await refundPayment(id, { reason: refundReason || undefined });
      setPayment(res.data as PaymentWithDetails);
      setShowRefund(false);
      setRefundReason('');
    } catch (err: any) {
      setRefundError(err.response?.data?.message || 'Refund failed. Please try again.');
    } finally {
      setRefunding(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-dim)' }}>
          <div className="status-dot pending" />
          Loading payment details...
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
        <div className="glass-panel" style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          <p style={{ color: '#ef4444' }}>{error || 'Payment not found.'}</p>
          <button className="btn-gold" onClick={() => navigate('/payments')} style={{ marginTop: '16px' }}>← Back to Payments</button>
        </div>
      </div>
    );
  }

  const statusCfg = STATUS_COLOR[payment.status] || STATUS_COLOR.pending;

  return (
    <div style={{ padding: '40px 8%', maxWidth: '900px', margin: '0 auto' }}>

      {/* Back + header */}
      <div style={{ marginBottom: '32px' }}>
        <button onClick={() => navigate('/payments')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.85rem', padding: 0, marginBottom: '16px' }}>
          ← Back to Transactions
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-dim)', marginBottom: '8px' }}>Payment Detail</div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 300, margin: 0 }}>
              #{String(payment._id || (payment as any).id || 'N/A').slice(-8).toUpperCase()}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              padding: '6px 16px', borderRadius: '100px',
              background: statusCfg.bg, color: statusCfg.color,
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px',
              border: `1px solid ${statusCfg.color}40`,
            }}>
              ● {statusCfg.label}
            </span>
            {payment.status === 'completed' && (
              <>
                <Link
                  to={`/payments/${payment._id || (payment as any).id}/invoice`}
                  style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: '#fff', padding: '8px 18px', borderRadius: '100px', fontSize: '0.8rem', textDecoration: 'none' }}
                >
                  Invoice
                </Link>
                <button
                  className="btn-gold"
                  onClick={() => setShowRefund(true)}
                  style={{ padding: '8px 18px', fontSize: '0.8rem', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }}
                >
                  Request Refund
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Amount Hero */}
      <div className="glass-panel" style={{ padding: '30px 40px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${statusCfg.color}` }}>
        <div>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '4px' }}>Total Amount</div>
          <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--accent-gold)', lineHeight: 1 }}>
            ${Number(payment.amount || 0).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', textTransform: 'uppercase' }}>{payment.currency}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '4px' }}>Date</div>
          <div style={{ fontWeight: 600 }}>{new Date(payment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{new Date(payment.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '6px', width: 'fit-content' }}>
        {(['payment', 'order', 'timeline'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === tab ? '#000' : 'var(--text-dim)',
              border: 'none', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: activeTab === tab ? 700 : 400,
              textTransform: 'capitalize', letterSpacing: '0.5px', transition: '0.2s',
            }}
          >
            {tab === 'payment' ? 'Payment' : tab === 'order' ? 'Order' : 'Timeline'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass-panel" style={{ padding: '32px' }}>

        {activeTab === 'payment' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
            {[
              { label: 'Payment ID', value: payment._id || (payment as any).id || 'N/A' },
              { label: 'Order ID', value: payment.orderId },
              { label: 'User ID', value: payment.userId },
              { label: 'Currency', value: (payment.currency || 'LKR').toUpperCase() },
              { label: 'Stripe Intent ID', value: payment.stripePaymentIntentId || '—' },
              { label: 'Payment Method ID', value: payment.stripePaymentMethodId || '—' },
              ...(payment.refundId ? [
                { label: 'Refund ID', value: payment.refundId },
                { label: 'Refund Reason', value: payment.refundReason || '—' },
              ] : []),
            ].map(({ label, value }) => (
              <div key={label} style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '6px' }}>{label}</div>
                <div style={{ fontSize: '0.9rem', fontFamily: value.length > 20 ? 'monospace' : 'inherit', wordBreak: 'break-all', color: 'var(--text-main)' }}>{value}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'order' && payment.orderDetails && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
            {[
              { label: 'Order ID', value: payment.orderDetails.id || (payment.orderDetails as any)._id },
              { label: 'Structure', value: payment.orderDetails.product ? 'Legacy Product' : 'Modern Multi-Item' },
              { label: 'Item Summary', value: payment.orderDetails.product || ((payment.orderDetails as any).items?.length ? `${(payment.orderDetails as any).items.length} items` : 'N/A') },
              { label: 'Total Value', value: `$${Number(payment.orderDetails.price || (payment.orderDetails as any).totalAmount || 0).toFixed(2)}` },
              { label: 'Order Status', value: (payment.orderDetails.status || 'N/A').toUpperCase() },
              { label: 'Customer ID', value: payment.orderDetails.userId },
            ].map(({ label, value }) => (
              <div key={label} style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '6px' }}>{label}</div>
                <div style={{ fontSize: '0.9rem' }}>{value}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'order' && !payment.orderDetails && (
          <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '20px 0' }}>Order details unavailable.</p>
        )}

        {activeTab === 'timeline' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { icon: '📋', label: 'Payment Created', time: payment.createdAt, desc: 'Payment record initiated in the system.', color: 'var(--accent-gold)' },
              ...(payment.status !== 'pending' ? [{ icon: payment.status === 'completed' ? '✅' : '❌', label: payment.status === 'completed' ? 'Payment Completed' : 'Payment Failed', time: payment.updatedAt, desc: payment.status === 'completed' ? 'Funds captured via Stripe.' : 'Transaction declined by payment processor.', color: payment.status === 'completed' ? '#10b981' : '#ef4444' }] : []),
              ...(payment.status === 'refunded' ? [{ icon: '↩', label: 'Refund Issued', time: payment.updatedAt, desc: `Refund processed. Reason: ${payment.refundReason || 'Not specified'}`, color: '#94a3b8' }] : []),
            ].map((event, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '16px', paddingBottom: '24px', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${event.color}20`, border: `2px solid ${event.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                    {event.icon}
                  </div>
                  {idx < 2 && <div style={{ width: '2px', flex: 1, background: 'var(--glass-border)', marginTop: '8px' }} />}
                </div>
                <div style={{ paddingTop: '4px' }}>
                  <div style={{ fontWeight: 600, marginBottom: '2px' }}>{event.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>{event.desc}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{new Date(event.time).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Refund Modal */}
      {showRefund && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 9999,
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '36px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 400, marginBottom: '8px' }}>Request <span style={{ color: '#ef4444' }}>Refund</span></h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '28px' }}>
              Amount to refund: <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>${(payment.amount || 0).toFixed(2)}</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)' }}>Reason (optional)</label>
              <input
                type="text"
                placeholder="e.g. Item not delivered"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            {refundError && (
              <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', fontSize: '0.85rem', marginBottom: '16px' }}>
                {refundError}
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleRefund}
                disabled={refunding}
                style={{ flex: 1, background: '#ef4444', border: 'none', color: '#fff', padding: '12px', borderRadius: '100px', cursor: 'pointer', fontWeight: 700 }}
              >
                {refunding ? 'Processing...' : 'Confirm Refund'}
              </button>
              <button
                onClick={() => { setShowRefund(false); setRefundError(''); setRefundReason(''); }}
                style={{ flex: 1, background: 'transparent', border: '1px solid var(--glass-border)', color: '#fff', padding: '12px', borderRadius: '100px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetail;
