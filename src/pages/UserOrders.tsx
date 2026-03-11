import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/api';
import { getPaymentsByUser } from '../services/paymentApi';

const STATUS_COLOR: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', label: 'PENDING' },
  completed: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', label: 'COMPLETED' },
  cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'CANCELLED' },
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cfg = STATUS_COLOR[status] || STATUS_COLOR.pending;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '100px',
        background: cfg.bg,
        color: cfg.color,
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '1px',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: cfg.color,
        }}
      />
      {cfg.label}
    </span>
  );
};

interface Order {
  id: number | string;
  _id?: string;
  status: string;
  product: string;
  quantity: number;
  price?: number;
  totalAmount?: number;
  totalPrice?: number;
}

const UserPayments: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  useEffect(() => {
    if (!user?.id) return;
    const fetchOrders = async () => {
      setLoading(true);
      setError('');

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

        const pendingOrders = list.filter((o: Order) =>
          o.status === 'pending' && !paidOrderIds.has(String(o.id || o._id))
        );

        setOrders(pendingOrders);
      } catch {
        setError('Unable to retrieve orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  if (!user) return <Navigate to="/login" replace />;

  const totalPages = Math.ceil(orders.length / PER_PAGE);
  const paginated = orders.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div style={{ padding: '40px 8%' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div
          style={{
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--text-dim)',
            marginBottom: '12px',
          }}
        >
          Orders
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 300, margin: 0 }}>
          My <span style={{ color: 'var(--accent-gold)' }}>Pending Orders</span>
        </h1>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}
      >
        <div className="glass-panel" style={{ padding: '20px 24px', borderRadius: '18px' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
            Pending Orders
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fbbf24' }}>
            {orders.length}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          Loading orders...
        </div>
      ) : error ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: '#ef4444' }}>{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📦</div>
          <h3>No pending orders</h3>
          <p style={{ color: 'var(--text-dim)' }}>
            You have no pending orders at the moment.
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {paginated.map((o) => (
              <div
                key={o.id}
                className="glass-panel"
                style={{
                  padding: '20px 28px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  borderLeft: `3px solid ${
                    STATUS_COLOR[o.status]?.color || '#94a3b8'
                  }`,
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: STATUS_COLOR[o.status]?.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ⏳
                </div>

                {/* Order Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>
                    Order #{o.id}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    {o.product} • Quantity: {o.quantity}
                  </div>
                </div>

                {/* Status */}
                <StatusBadge status={o.status} />

                {/* Price */}
                <div style={{ fontWeight: 700, minWidth: '90px', textAlign: 'right' }}>
                  Rs. {Number(o.price || o.totalAmount || o.totalPrice || 0).toFixed(2)}
                </div>

                {/* Pay Now */}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '32px',
              }}
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ←
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
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