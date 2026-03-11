import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getMenuItems, getCategories, createMenuItem, updateMenuItem, deleteMenuItem,
  getAllOrders, deleteOrder,
  getAllPayments, refundPayment,
  getAllUsers, deleteUser
} from '../services/api';

type Tab = 'menu' | 'orders' | 'payments' | 'users';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('menu');
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [navigate, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      switch (activeTab) {
        case 'menu': 
          res = await getMenuItems(); 
          // Also fetch categories if in menu tab
          const catRes = await getCategories();
          if (catRes.data?.success) setCategories(catRes.data.data);
          break;
        case 'orders': res = await getAllOrders(); break;
        case 'payments': res = await getAllPayments(); break;
        case 'users': res = await getAllUsers(); break;
      }
      
      // Handle different API response structures
      if (activeTab === 'menu') {
          if (res?.data?.success) setData(res.data.data);
      } else if (activeTab === 'payments') {
          // Payments often returns { success: true, data: { payments: [...] } }
          setData(res?.data?.data?.payments || res?.data?.data || []);
      } else if (activeTab === 'users') {
          // Identity service might return array directly or wrapped
          setData(Array.isArray(res?.data) ? res.data : (res?.data?.data || []));
      } else {
          // Orders
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
      } catch (err) { alert('Operation failed.'); }
    }
  };

  const handleRefund = async (id: any) => {
    if (window.confirm('Initiate refund sequence for this transaction?')) {
      try {
        await refundPayment(id);
        fetchData();
      } catch (err) { alert('Refund operation failed.'); }
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
                  isAvailable: 1,
                  restaurantId: 1,
                  restaurantName: 'Gourmet Express',
                  categoryId: 1 
                })} 
                className="btn-gold" 
                style={{ background: 'var(--success)' }}
              >
                + New Food Item
              </button>
            </div>
            {renderTable(['UUID', 'Structure', 'Category', 'Price', 'Actions'], data.map(item => [
              String(item.id).substring(0, 8),
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {item.imageUrl && <img src={item.imageUrl} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />}
                <div>{item.name}</div>
              </div>,
              item.categoryName,
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
          u.id,
          u.username,
          u.email,
          u.vegan ? '🌱 Vegan' : '🥩 Standard',
          <button onClick={() => handleDelete(u.id)} style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'none', padding: '5px 12px', borderRadius: '6px' }}>Flush User</button>
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

      {editForm && activeTab === 'menu' && (
        <div className="glass-panel fade-in" style={{ marginBottom: '40px', border: '1px solid #eab308' }}>
          <h3 style={{ marginTop: 0, color: '#eab308' }}>{editForm.id ? 'Modify Parameters' : 'Synthesize New Component'}</h3>
          <form onSubmit={handleSaveMenu} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'block' }}>NAME</label>
              <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'block' }}>CATEGORY</label>
              <select 
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
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'block' }}>PRICE (LKR)</label>
              <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'block' }}>IMAGE URL</label>
              <input value={editForm.imageUrl} onChange={e => setEditForm({...editForm, imageUrl: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', width: '100%' }} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'block' }}>SPECS / DESCRIPTION</label>
              <textarea style={{ gridColumn: 'span 2', width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', minHeight: '100px' }} value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button type="button" onClick={() => setEditForm(null)} className="btn-gold" style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }}>Discard Changes</button>
              <button type="submit" className="btn-gold">Commit to Catalog</button>
            </div>
          </form>
        </div>
      )}

      {renderTabContent()}
    </div>
  );
};

export default AdminDashboard;
