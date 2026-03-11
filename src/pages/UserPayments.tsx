import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPaymentsByUser } from '../services/paymentApi';
import { getUserOrders } from '../services/api';
import type { Payment, PaymentStatus } from '../types/payment';

interface PendingOrder {
  id: number | string;
  _id?: string;
  status: string;
  product: string;
  quantity: number;
  price?: number;
  totalAmount?: number;
  totalPrice?: number;
}

const STATUS_COLOR: Record<string, { bg: string; color: string; label: string }> = {
  succeeded:  { bg: 'rgba(16,185,129,0.15)', color: '#10b981', label: 'SUCCEEDED' },
  completed:  { bg: 'rgba(16,185,129,0.15)', color: '#10b981', label: 'COMPLETED' },
  pending:    { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24', label: 'PENDING' },
  processing: { bg: 'rgba(59,130,246,0.15)',  color: '#3b82f6', label: 'PROCESSING' },
  failed:     { bg: 'rgba(239,68,68,0.15)',   color: '#ef4444', label: 'FAILED' },
  refunded:   { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8', label: 'REFUNDED' },
};

const StatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  const cfg = STATUS_COLOR[status] || STATUS_COLOR.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '4px 10px', borderRadius: '100px',
      background: cfg.bg, color: cfg.color,
      fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1px',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }} />
      {cfg.label}
    </span>
  );
};

const UserPayments: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    const fetchPayments = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getPaymentsByUser(user.id?.toString() || '');
        const raw = res.data as any;
        const list: Payment[] =
          Array.isArray(raw) ? raw :
          Array.isArray(raw?.data?.payments) ? raw.data.payments :
          Array.isArray(raw?.data) ? raw.data :
          [];
        setPayments(
          [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        );
      } catch {
        setError('Unable to retrieve payment history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const fetchPendingOrders = async () => {
      try {
        const [ordersRes, paymentsRes] = await Promise.all([
          getUserOrders(user.id?.toString() || ''),
          getPaymentsByUser(user.id?.toString() || ''),
        ]);

        const list = Array.isArray(ordersRes.data) ? ordersRes.data : [];

        const raw = (paymentsRes.data as any);
        const allPayments: any[] =
          Array.isArray(raw) ? raw :
          Array.isArray(raw?.data?.payments) ? raw.data.payments :
          Array.isArray(raw?.data) ? raw.data : [];

        const paidOrderIds = new Set(
          allPayments
            .filter((p: any) => p.status === 'succeeded' || p.status === 'completed')
            .map((p: any) => String(p.orderId))
        );

        const lsPaid: string[] = JSON.parse(localStorage.getItem('paidOrders') || '[]');
        lsPaid.forEach(id => paidOrderIds.add(id));
        localStorage.setItem('paidOrders', JSON.stringify([...paidOrderIds]));

        setPendingOrders(
          list.filter((o: PendingOrder) =>
            o.status === 'pending' && !paidOrderIds.has(String(o.id || o._id))
          )
        );
      } catch {
        // silently ignore
      }
    };
    fetchPendingOrders();
  }, [user?.id]);

  if (!user) return <Navigate to="/login" replace />;

  const isSuccess = (s: string) => s === 'succeeded' || s === 'completed';

  const totalPages = Math.ceil(payments.length / PER_PAGE);
  const paginated = payments.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalSpent = payments.filter(p => isSuccess(p.status)).reduce((sum, p) => sum + p.amount, 0);

  return (
    <div style={{ padding: '40px 8%' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-dim)', marginBottom: '12px' }}>
          Payment History
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 300, margin: 0 }}>
          My <span style={{ color: 'var(--accent-gold)' }}>Transactions</span>
        </h1>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {[
          { label: 'Total Payments', value: payments.length, color: 'var(--accent-gold)' },
          { label: 'Succeeded', value: payments.filter(p => isSuccess(p.status)).length, color: '#10b981' },
          { label: 'Pending Orders', value: pendingOrders.length, color: '#fbbf24' },
          { label: 'Total Spent', value: `Rs. ${(totalSpent || 0).toFixed(2)}`, color: 'var(--accent-gold)' },
        ].map((stat) => (
          <div key={stat.label} className="glass-panel" style={{ padding: '20px 24px', borderRadius: '18px' }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Action Row */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button className="btn-gold" onClick={() => navigate('/payments/checkout')} style={{ padding: '10px 24px', fontSize: '0.85rem' }}>
          + New Payment
        </button>
      </div>

      {/* Pending Orders */}
      {pendingOrders.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#fbbf24', marginBottom: '16px' }}>
            Pending Orders — Pay Now
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingOrders.map(o => (
              <div
                key={String(o.id || o._id)}
                className="glass-panel"
                style={{
                  padding: '20px 28px', borderRadius: '16px',
                  display: 'flex', alignItems: 'center', gap: '20px',
                  borderLeft: '3px solid #fbbf24',
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(251,191,36,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ⏳
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>Order #{String(o.id || o._id)}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{o.product} • Qty: {o.quantity}</div>
                </div>
                <StatusBadge status="pending" />
                <div style={{ fontWeight: 700, minWidth: '90px', textAlign: 'right' }}>
                  Rs. {Number(o.price || o.totalAmount || o.totalPrice || 0).toFixed(2)}
                </div>
                <button
                  className="btn-gold"
                  onClick={() => navigate(`/payments/checkout/${o.id || o._id}`)}
                  style={{ padding: '8px 20px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                >
                  Pay Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History */}
      {loading ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--text-dim)' }}>
            <div className="status-dot pending" />
            Loading transactions...
          </div>
        </div>
      ) : error ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>
          <button className="btn-gold" onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : payments.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💳</div>
          <h3 style={{ fontWeight: 300, marginBottom: '8px' }}>No transactions yet</h3>
          <p style={{ color: 'var(--text-dim)', marginBottom: '24px', fontSize: '0.9rem' }}>Your payment history will appear here after your first order.</p>
          <Link to="/payments/checkout" className="btn-gold" style={{ padding: '12px 28px' }}>Make Your First Payment</Link>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {paginated.map((p) => (
              <div
                key={p._id || (p as any).id}
                className="glass-panel"
                style={{
                  padding: '20px 28px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  borderLeft: `3px solid ${STATUS_COLOR[p.status]?.color || '#94a3b8'}`,
                }}
                onClick={() => navigate(`/payments/${p._id || (p as any).id}`)}
              >
                {/* Icon */}
                <div style={{
                  width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
                  background: STATUS_COLOR[p.status]?.bg || 'rgba(148,163,184,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                }}>
                  {p.status === 'succeeded' || p.status === 'completed' ? '✓' : p.status === 'failed' ? '✗' : p.status === 'refunded' ? '↩' : '⏳'}
                </div>

                {/* Main Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Order #{String(p.orderId || 'N/A').slice(-8).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    {new Date(p.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Status */}
                <StatusBadge status={p.status} />

                {/* Amount */}
                <div style={{ textAlign: 'right', minWidth: '80px' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: p.status === 'refunded' ? '#94a3b8' : 'var(--text-main)' }}>
                    {p.status === 'refunded' ? '-' : ''}Rs. {(p.amount || 0).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{p.currency || 'LKR'}</div>
                </div>

                {/* Arrow */}
                <div style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>›</div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: page === 1 ? 'var(--text-dim)' : '#fff', padding: '8px 16px', borderRadius: '8px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  style={{
                    background: page === i + 1 ? 'var(--accent-gold)' : 'transparent',
                    border: `1px solid ${page === i + 1 ? 'var(--accent-gold)' : 'var(--glass-border)'}`,
                    color: page === i + 1 ? '#000' : '#fff',
                    padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: page === i + 1 ? 700 : 400,
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: page === totalPages ? 'var(--text-dim)' : '#fff', padding: '8px 16px', borderRadius: '8px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserPayments;
