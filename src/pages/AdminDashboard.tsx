import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getMenuItems, getCategories, createMenuItem, updateMenuItem, deleteMenuItem,
  getAllOrders, deleteOrder,
  getAllPayments, refundPayment,
  getAllUsers, deleteUser,
  getMenuIntegrationStatus
} from '../services/api';

type Tab = 'menu' | 'orders' | 'payments' | 'users';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('menu');
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState<any>(null);
  const [integrationStatus, setIntegrationStatus] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin/login');
      return;
    }
    fetchData();
    fetchIntegrationStatus();
  }, [navigate, activeTab]);

  const fetchIntegrationStatus = async () => {
    try {
      const res = await getMenuIntegrationStatus();
      if (res.data?.success) {
        setIntegrationStatus(res.data.services);
      }
    } catch (err) {
      console.error('Could not load integration status', err);
      setIntegrationStatus(null);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      switch (activeTab) {
        case 'menu':
          res = await getMenuItems();
          const catRes = await getCategories();
          if (catRes.data?.success) setCategories(catRes.data.data);
          break;
        case 'orders':
          res = await getAllOrders();
          break;
        case 'payments':
          res = await getAllPayments();
          break;
        case 'users':
          res = await getAllUsers();
          break;
      }

      if (activeTab === 'menu') {
        if (res?.data?.success) setData(res.data.data);
      } else if (activeTab === 'payments') {
        setData(res?.data?.data?.payments || res?.data?.data || []);
      } else if (activeTab === 'users') {
        setData(Array.isArray(res?.data) ? res.data : (res?.data?.data || []));
      } else {
        setData(res?.data?.data || res?.data || []);
      }
    } catch (err) {
      console.error(`Could not load ${activeTab}`, err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (window.confirm(`WARNING: Deleting this entry from the ${activeTab} cluster?`)) {
      try {
        switch (activeTab) {
          case 'menu': await deleteMenuItem(id); break;
          case 'orders': await deleteOrder(id); break;
          case 'users': await deleteUser(id); break;
          default: alert("Action not permitted for this node."); return;
        }
        fetchData();
      } catch (err) {
        alert('Operation failed.');
      }
    }
  };

  const handleRefund = async (id: any) => {
    if (window.confirm('Initiate refund sequence for this transaction?')) {
      try {
        await refundPayment(id);
        fetchData();
      } catch (err) {
        alert('Refund operation failed.');
      }
    }
  };

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editForm.id) {
        await updateMenuItem(editForm.id, editForm);
      } else {
        await createMenuItem(editForm);
      }
      setEditForm(null);
      fetchData();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save catalog changes. Check console for vector errors.');
    }
  };

  const renderServiceBadge = (name: string, service: any) => {
    const up = service?.status === 'up';
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 18px',
        borderRadius: '14px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '10px'
      }}>
        <span style={{ color: '#fff', fontWeight: 600 }}>{name}</span>
        <span style={{
          color: up ? '#22c55e' : '#ef4444',
          fontWeight: 700,
          fontSize: '0.8rem',
          letterSpacing: '1px'
        }}>
          {up ? 'LIVE' : 'DOWN'}
        </span>
      </div>
    );
  };

  const renderTabContent = () => {
    if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: '#eab308' }}>Syncing Network Nodes...</div>;

    switch (activeTab) {
      case 'menu':
        return (
          <div className="fade-in">
            <div style={{ marginBottom: '20px', textAlign: 'right' }}>
              <button
                onClick={() => setEditForm({
                  name: '',
                  description: '',
                  price: 0,
                  categoryName: 'General',
                  imageUrl: '',
                  isAvailable: true,
                  vegan: false,
                  restaurantId: 1,
                  restaurantName: 'Gourmet Express',
                  categoryId: categories.length > 0 ? categories[0].id : 1
                })}
                className="btn-gold"
                style={{ background: 'var(--success)' }}
              >
                + New Food Item
              </button>
            </div>

            {renderTable(['UUID', 'Structure', 'Category', 'Diet', 'Price', 'Actions'], data.map(item => [
              String(item.id).substring(0, 8),
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {item.imageUrl && <img src={item.imageUrl} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />}
                <div>{item.name}</div>
              </div>,
              item.categoryName,
              item.vegan ? '🌱 Vegan' : '🥩 Standard',
              `LKR ${item.price?.toFixed(2)}`,
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => setEditForm(item)} style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: '#fff', padding: '5px 12px', borderRadius: '6px' }}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '5px 12px', borderRadius: '6px' }}>Delete</button>
              </div>
            ]))}
          </div>
        );

      case 'orders':
        return renderTable(['Order Ref', 'Description', 'Quantity', 'Total Value', 'Status', 'Actions'], data.map(order => {
          const statusText = (order.status || 'PENDING').toUpperCase();
          const statusColor = statusText === 'COMPLETED' ? '#4ade80' : statusText === 'CANCELLED' ? '#ef4444' : '#fbbf24';
          return [
            String(order.id || order._id).substring(0, 8).toUpperCase(),
            order.product || 'Complex Order',
            order.quantity || 0,
            `LKR ${Number(order.totalAmount || order.price || 0).toLocaleString()}`,
            <span style={{ color: statusColor, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '1px' }}>{statusText}</span>,
            <button key="action" onClick={() => handleDelete(order.id || order._id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '6px 15px', borderRadius: '100px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Revoke</button>
          ];
        }));

      case 'payments':
        return renderTable(['Tx ID', 'Order', 'Amount', 'Status', 'Method', 'Actions'], data.map(pay => [
          String(pay.id).substring(0, 8),
          pay.orderId,
          `LKR ${pay.amount?.toFixed(2)}`,
          <span style={{ color: pay.status === 'completed' ? '#4ade80' : '#ef4444' }}>{pay.status}</span>,
          pay.paymentMethod,
          pay.status === 'completed' && (
            <button onClick={() => handleRefund(pay.id)} style={{ background: '#ca8a04', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '6px' }}>Refund</button>
          )
        ]));

      case 'users':
        return renderTable(['ID', 'Identifer', 'Email', 'Diet', 'Actions'], data.map(u => [
          u.id || u._id,
          u.username,
          u.email,
          u.vegan ? '🌱 Vegan' : '🥩 Standard',
          <button onClick={() => handleDelete(u.id || u._id)} style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'none', padding: '5px 12px', borderRadius: '6px' }}>Flush User</button>
        ]));
    }
  };

  const renderTable = (headers: string[], rows: any[][]) => (
    <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
              {headers.map(h => <th key={h} style={{ padding: '20px', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '1px' }}>{(h || '').toUpperCase()}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                {row.map((cell, j) => <td key={j} style={{ padding: '20px', fontSize: '0.9rem' }}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '40px 8%', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', alignItems: 'start', marginBottom: '30px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontWeight: 300 }}>Admin <span style={{ color: '#eab308' }}>Control Terminal</span></h1>
            <button onClick={() => { localStorage.removeItem('adminAuth'); navigate('/admin/login'); }} className="btn-gold" style={{ background: '#ef4444' }}>Logout</button>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
            {(['menu', 'orders', 'payments', 'users'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => { setActiveTab(t); setEditForm(null); }}
                style={{
                  padding: '10px 25px',
                  borderRadius: '100px',
                  background: activeTab === t ? '#eab308' : 'var(--glass)',
                  color: activeTab === t ? '#000' : '#fff',
                  border: '1px solid',
                  borderColor: activeTab === t ? '#eab308' : 'var(--glass-border)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  textTransform: 'capitalize'
                }}
              >{t}</button>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '18px', color: '#eab308' }}>Service Integration Status</h3>
          {integrationStatus ? (
            <>
              {renderServiceBadge('User Service', integrationStatus.userService)}
              {renderServiceBadge('Order Service', integrationStatus.orderService)}
            </>
          ) : (
            <p style={{ color: 'var(--text-dim)' }}>Unable to load integration status</p>
          )}
        </div>
      </div>

      {editForm && activeTab === 'menu' && (
        <div className="glass-panel fade-in" style={{ marginBottom: '40px', border: '1px solid #eab308' }}>
          <h3 style={{ marginTop: 0, color: '#eab308' }}>{editForm.id ? 'Modify Parameters' : 'Synthesize New Component'}</h3>
          <form onSubmit={handleSaveMenu} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label htmlFor="edit-item-name" style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'block' }}>NAME</label>
              <input id="edit-item-name" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', width: '100%' }} />
            </div>

            <div>
              <label htmlFor="edit-item-category" style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'block' }}>CATEGORY</label>
              <select
                id="edit-item-category"
                aria-label="Category"
                value={editForm.categoryId}
                onChange={e => {
                  const selectedCat = categories.find(c => c.id === parseInt(e.target.value));
                  setEditForm({
                    ...editForm,
                    categoryId: selectedCat?.id,
                    categoryName: selectedCat?.name
                  });
                }}
                style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', width: '100%', cursor: 'pointer' }}
              >
                <option value="" disabled style={{ background: '#1e293b' }}>Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id} style={{ background: '#1e293b' }}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="edit-item-price" style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'block' }}>PRICE (LKR)</label>
              <input id="edit-item-price" type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: parseFloat(e.target.value) })} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', width: '100%' }} />
            </div>

            <div>
              <label htmlFor="edit-item-image" style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'block' }}>IMAGE URL</label>
              <input id="edit-item-image" value={editForm.imageUrl} onChange={e => setEditForm({ ...editForm, imageUrl: e.target.value })} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', width: '100%' }} />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label htmlFor="edit-item-description" style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'block' }}>SPECS / DESCRIPTION</label>
              <textarea id="edit-item-description" style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', minHeight: '80px' }} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
            </div>

            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '30px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={editForm.isAvailable} onChange={e => setEditForm({ ...editForm, isAvailable: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                <span style={{ fontSize: '0.9rem' }}>AVAILABLE IN STOCK</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={editForm.vegan} onChange={e => setEditForm({ ...editForm, vegan: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                <span style={{ fontSize: '0.9rem' }}>VEGAN OPTION</span>
              </label>

              <div style={{ flex: 1 }}></div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button type="button" onClick={() => setEditForm(null)} className="btn-gold" style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }}>Discard Changes</button>
                <button type="submit" className="btn-gold">Commit to test</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {renderTabContent()}
    </div>
  );
};

export default AdminDashboard;