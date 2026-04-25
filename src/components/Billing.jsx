import React, { useState } from 'react';
import { UserPlus, ArrowUpDown, CheckCircle, Pencil, Trash2 } from 'lucide-react';

export default function Clients({ clients, onAddClient, onEditClient, onDeleteClient }) {
  const [clientSort, setClientSort] = useState('asc');
  const [toastMessage, setToastMessage] = useState('');

  const [newName, setNewName] = useState('');
  const [newLoc, setNewLoc] = useState('');
  const [newRate, setNewRate] = useState('');

  const [editingId, setEditingId] = useState(null);

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!newName || !newLoc || !newRate) return;
    
    if (editingId) {
      onEditClient({
        id: editingId,
        name: newName.toUpperCase(),
        location: newLoc.toUpperCase(),
        rate: Number(newRate),
        color: clients.find(c => c.id === editingId)?.color || ''
      });
      setToastMessage('Client updated successfully!');
    } else {
      onAddClient({
        id: Date.now(),
        name: newName.toUpperCase(),
        location: newLoc.toUpperCase(),
        rate: Number(newRate)
      });
      setToastMessage('Client added successfully!');
    }
    
    setTimeout(() => setToastMessage(''), 3000);
    setNewName(''); setNewLoc(''); setNewRate('');
    setEditingId(null);
  };

  const handleEdit = (client) => {
    setEditingId(client.id);
    setNewName(client.name);
    setNewLoc(client.location);
    setNewRate(client.rate);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      onDeleteClient(id);
      setToastMessage('Client deleted successfully!');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Client Directory</h1>
        <p className="page-subtitle">Manage your clients and their customized rates</p>
      </div>

      <div className="card-panel">
        <div className="panel-header">
          <h2>{editingId ? 'Edit Client' : 'Add New Client'}</h2>
        </div>
        <form onSubmit={handleAddClient} className="form-grid">
          <div className="form-group">
            <label>Company Name</label>
            <input type="text" className="form-control" value={newName} onChange={e => setNewName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input type="text" className="form-control" value={newLoc} onChange={e => setNewLoc(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Rate Per Tanker (₹)</label>
            <input type="number" className="form-control" min="0" value={newRate} onChange={e => setNewRate(e.target.value)} />
          </div>
          <div className="form-group" style={{justifyContent: 'flex-end'}}>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={() => {
                setEditingId(null); setNewName(''); setNewLoc(''); setNewRate('');
              }} style={{marginRight: '1rem', background: 'var(--bg-lighter)', color: 'var(--text-main)'}}>
                Cancel
              </button>
            )}
            <button type="submit" className="btn"><UserPlus size={18} /> {editingId ? 'Update Client' : 'Add Client'}</button>
          </div>
        </form>
      </div>

      <div className="card-panel">
        <div className="panel-header">
          <h2>Client List</h2>
        </div>
        <div style={{overflowX: 'auto'}}>
          <table>
            <thead>
              <tr>
                <th>
                  Client / Company
                  <button 
                    type="button"
                    onClick={() => setClientSort(clientSort === 'asc' ? 'desc' : 'asc')} 
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginLeft: '6px', verticalAlign: 'middle' }}
                    title="Sort by name"
                  >
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th>Location</th>
                <th>Contract Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(c => c).sort((a,b) => clientSort === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)).map(c => (
                <tr key={c.id}>
                  <td data-label="Company" style={{fontWeight: 600}}>
                    <span style={{ 
                      background: c.color || 'transparent', 
                      color: c.color ? '#000' : 'var(--text-main)', 
                      padding: c.color ? '4px 8px' : '0', 
                      borderRadius: '4px', 
                      display: 'inline-block'
                    }}>
                      {c.name}
                    </span>
                  </td>
                  <td data-label="Location">{c.location}</td>
                  <td data-label="Contract Rate">₹{c.rate} / tanker</td>
                  <td data-label="Actions">
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleEdit(c)} className="action-btn" title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="action-btn text-danger" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {clients.length === 0 && <p style={{textAlign: 'center', padding: '2rem', color: 'var(--text-muted)'}}>No clients found.</p>}
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
          <CheckCircle size={20} />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
