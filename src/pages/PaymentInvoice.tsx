import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInvoice } from '../services/paymentApi';
import type { PaymentWithDetails } from '../types/payment';

const PaymentInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [payment, setPayment] = useState<PaymentWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getInvoice(id);
        setPayment(res.data?.data ?? (res.data as any));
      } catch {
        setError('Invoice not found.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-dim)' }}>
          <div className="status-dot pending" />
          Generating invoice...
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
        <div className="glass-panel" style={{ maxWidth: '500px', textAlign: 'center' }}>
          <p style={{ color: '#ef4444' }}>{error || 'Invoice unavailable.'}</p>
          <button className="btn-gold" onClick={() => navigate('/payments')} style={{ marginTop: '16px' }}>← Back</button>
        </div>
      </div>
    );
  }

  const subtotal = payment.amount || 0;
  const tax = 0;
  const total = subtotal + tax;
  // Backend invoice endpoint returns issuedAt + paymentId; full payment detail returns createdAt + _id
  const rawDate = (payment as any).issuedAt || payment.createdAt;
  const invoiceDate = rawDate ? new Date(rawDate) : new Date();
  const paymentId = payment._id || (payment as any).paymentId || (payment as any).id || '';
  const invoiceNumber = `INV-${invoiceDate.getFullYear()}${String(invoiceDate.getMonth() + 1).padStart(2, '0')}-${String(paymentId || 'N/A').slice(-6).toUpperCase()}`;
  const currency = ((payment as any).currency || 'LKR').toUpperCase();

  return (
    <div style={{ padding: '20px 8%' }}>

      {/* Screen-only toolbar */}
      <div className="no-print" style={{ display: 'flex', gap: '12px', marginBottom: '24px', justifyContent: 'flex-end' }}>
        <button onClick={() => navigate(`/payments/${paymentId}`)} style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: '#fff', padding: '8px 20px', borderRadius: '100px', cursor: 'pointer', fontSize: '0.85rem' }}>
          ← Detail
        </button>
        <button className="btn-gold" onClick={handlePrint} style={{ padding: '8px 24px', fontSize: '0.85rem' }}>
          🖨️ Print / Save PDF
        </button>
      </div>

      {/* Invoice Document */}
      <div id="invoice-doc" className="glass-panel" style={{ padding: '60px', maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
          <div>
            <div className="brand-text" style={{ fontSize: '1.4rem', marginBottom: '4px' }}>Gourmet.Express</div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Payment Invoice</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-gold)' }}>{invoiceNumber}</div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '4px' }}>
              {invoiceDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginTop: '2px' }}>
              {invoiceDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div style={{ marginTop: '12px' }}>
              <span style={{
                padding: '4px 12px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1px',
                background: (payment.status === 'succeeded' || payment.status === 'completed') ? 'rgba(16,185,129,0.15)' : 'rgba(251,191,36,0.15)',
                color: (payment.status === 'succeeded' || payment.status === 'completed') ? '#10b981' : '#fbbf24',
                border: `1px solid ${(payment.status === 'succeeded' || payment.status === 'completed') ? '#10b981' : '#fbbf24'}40`,
              }}>
                {payment.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--glass-border)', marginBottom: '40px' }} />

        {/* Bill To / From */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '48px' }}>
          <div>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-dim)', marginBottom: '12px' }}>Bill To</div>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>
              {payment.userDetails?.username || `User #${String(payment.userId || 'N/A').slice(-6)}`}
            </div>
            {payment.userDetails?.email && (
              <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{payment.userDetails.email}</div>
            )}
            {payment.userDetails?.deliveryAddress && (
              <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '4px' }}>{payment.userDetails.deliveryAddress}</div>
            )}
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-dim)', marginBottom: '12px' }}>Payment Reference</div>
            <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div><span style={{ color: 'var(--text-dim)' }}>Payment ID: </span>{paymentId}</div>
              <div><span style={{ color: 'var(--text-dim)' }}>Order ID: </span>{payment.orderId || (payment as any).orderId}</div>
              {payment.stripePaymentIntentId && (
                <div><span style={{ color: 'var(--text-dim)' }}>Stripe Intent: </span>{payment.stripePaymentIntentId}</div>
              )}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              {['Description', 'Qty', 'Unit Price', 'Total'].map(h => (
                <th key={h} style={{ textAlign: h === 'Description' ? 'left' : 'right', padding: '10px 0', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ padding: '14px 0', fontSize: '0.95rem' }}>
                {payment.orderDetails?.product || 'Order Item'}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  Order #{String(payment.orderId || 'N/A').slice(-8).toUpperCase()}
                </div>
              </td>
              <td style={{ padding: '14px 0', textAlign: 'right' }}>{payment.orderDetails?.quantity ?? 1}</td>
              <td style={{ padding: '14px 0', textAlign: 'right' }}>
                Rs. {(payment.orderDetails?.price ?? (payment.amount || 0)).toFixed(2)}
              </td>
              <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 600 }}>Rs. {(subtotal || 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Subtotal</span>
              <span>Rs. {(subtotal || 0).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Tax (0%)</span>
              <span>Rs. 0.00</span>
            </div>
            <div style={{ height: '1px', background: 'var(--glass-border)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>Total</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                Rs. {(total || 0).toFixed(2)} <span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--text-dim)' }}>{currency}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', lineHeight: 1.8 }}>
            Thank you for your order with <span style={{ color: 'var(--accent-gold)' }}>Gourmet Express</span>.<br />
            Powered by a distributed microservices architecture. Payments secured by Stripe.
          </div>
        </div>
      </div>

      {/* Print-specific styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; color: #000 !important; }
          .glass-panel { background: #fff !important; border: 1px solid #ddd !important; backdrop-filter: none !important; }
          .brand-text { color: #b8860b !important; }
          :root { --accent-gold: #b8860b; --text-dim: #555; --text-main: #000; --glass-border: #ddd; }
        }
      `}</style>
    </div>
  );
};

export default PaymentInvoice;
