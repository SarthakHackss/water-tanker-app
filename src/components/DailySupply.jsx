import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';

export default function DailySupply({ supplies, clients, onAddSupply, onEditSupply, onDeleteSupply }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [clientId, setClientId] = useState('');
  const [tankCount, setTankCount] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [toastMessage, setToastMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientId || !tankCount) return;
    
    if (editingId) {
      onEditSupply({
        id: editingId,
        date,
        clientId: Number(clientId),
        tankCount: Number(tankCount)
      });
      setToastMessage('Supply entry updated successfully!');
      setEditingId(null);
    } else {
      onAddSupply({
        id: Date.now(),
        date,
        clientId: Number(clientId),
        tankCount: Number(tankCount)
      });
      setToastMessage('Supply entry added successfully!');
    }
    
    setTimeout(() => setToastMessage(''), 3000);
    setTankCount('');
    setClientId('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleEditClick = (s) => {
    setEditingId(s.id);
    setDate(s.date);
    setClientId(s.clientId);
    setTankCount(s.tankCount);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTankCount('');
    setClientId('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const sortedSupplies = [...supplies].sort((a, b) => {
    const da = new Date(a.date);
    const db = new Date(b.date);
    return sortOrder === 'desc' ? db - da : da - db;
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Daily Supply</h1>
        <p className="page-subtitle">Log new deliveries and view history</p>
      </div>

      <div className="card-panel">
        <div className="panel-header">
          <h2>{editingId ? 'Edit Supply' : 'Add New Supply'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Date</label>
            <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Client / Company</label>
            <select className="form-control" value={clientId} onChange={e => setClientId(e.target.value)}>
              <option value="">Select a client...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>No. of Tankers</label>
            <input type="number" className="form-control" min="1" value={tankCount} onChange={e => setTankCount(e.target.value)} />
          </div>
          <div className="form-group" style={{justifyContent: 'flex-end', flexDirection: 'row', gap: '0.5rem', alignItems: 'flex-end'}}>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
            )}
            <button type="submit" className="btn">
              {editingId ? <><Pencil size={18} /> Update Supply</> : <><Plus size={18} /> Add Supply</>}
            </button>
          </div>
        </form>
      </div>

      <div className="card-panel">
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Supply Log</h2>
        </div>
        <div style={{overflowX: 'auto'}}>
          <table>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>
                  Date 
                  <button 
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')} 
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginLeft: '6px', verticalAlign: 'middle' }}
                    title="Sort by date"
                  >
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th>Company</th>
                <th>Location</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedSupplies.map((s, index) => {
                const client = clients.find(c => c.id === s.clientId) || {};
                const total = s.tankCount * (client.rate || 0);
                return (
                  <tr key={s.id}>
                    <td data-label="Sr. No." style={{ color: 'var(--text-muted)' }}>{index + 1}</td>
                    <td data-label="Date">{s.date && format(new Date(s.date), 'dd-MMM-yy').toLowerCase()}</td>
                    <td data-label="Company">
                      <span style={{ 
                        background: client.color || 'transparent', 
                        color: client.color ? '#000' : 'var(--text-main)', 
                        padding: client.color ? '4px 8px' : '0', 
                        borderRadius: '4px', 
                        fontWeight: client.color ? 'bold' : 'normal',
                        display: 'inline-block'
                      }}>
                        {client.name}
                      </span>
                    </td>
                    <td data-label="Location">{client.location}</td>
                    <td data-label="Quantity"><span className="badge badge-blue">{s.tankCount}</span></td>
                    <td data-label="Rate">₹{client.rate}</td>
                    <td data-label="Total Amount" style={{fontWeight: 600}}>₹{total.toLocaleString()}</td>
                    <td data-label="Actions">
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          type="button"
                          onClick={() => handleEditClick(s)} 
                          className="btn btn-secondary" 
                          style={{ padding: '0.4rem', border: 'none', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button 
                          type="button"
                          onClick={() => { 
                            if(window.confirm('Are you sure you want to delete this supply entry?')) {
                              onDeleteSupply(s.id);
                              setToastMessage('Supply deleted successfully!');
                              setTimeout(() => setToastMessage(''), 3000);
                            }
                          }} 
                          className="btn btn-secondary" 
                          style={{ padding: '0.4rem', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {supplies.length === 0 && <p style={{textAlign: 'center', padding: '2rem', color: 'var(--text-muted)'}}>No supply records found.</p>}
        </div>
      </div>
      
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#34d399',
          color: '#000',
          padding: '1rem 1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontWeight: 'bold',
          transition: 'all 0.3s ease'
        }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
