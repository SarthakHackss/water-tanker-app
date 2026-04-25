import React, { useState } from 'react';
import { Plus, ArrowUpDown, ChevronDown, ChevronRight, CheckCircle, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { expenseCategories } from '../mockData';

export default function Expenses({ expenses, onAddExpense, onEditExpense, onDeleteExpense }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(expenseCategories[0]);
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [toastMessage, setToastMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;

    if (editingId) {
      onEditExpense({
        id: editingId,
        date,
        category,
        amount: Number(amount),
        description: desc
      });
      setToastMessage('Expense updated successfully!');
      setEditingId(null);
    } else {
      onAddExpense({
        id: Date.now(),
        date,
        category,
        amount: Number(amount),
        description: desc
      });
      setToastMessage(`Expense: ${desc || 'Item'} (₹${amount}) added successfully!`);
    }
    
    setTimeout(() => setToastMessage(''), 3000);
    setAmount('');
    setDesc('');
  };

  const handleEditClick = (expense) => {
    setEditingId(expense.id);
    setDate(expense.date);
    setCategory(expense.category);
    setDesc(expense.description);
    setAmount(expense.amount);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      onDeleteExpense(id);
      setToastMessage('Expense deleted successfully!');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const groupedExpenses = expenses.reduce((acc, curr) => {
    if (!curr.date) return acc;
    const dateObj = new Date(curr.date);
    const monthKey = format(dateObj, 'yyyy-MM');
    if (!acc[monthKey]) {
      acc[monthKey] = {
        id: monthKey,
        title: format(dateObj, 'MMMM yyyy'),
        total: 0,
        items: []
      };
    }
    acc[monthKey].items.push(curr);
    acc[monthKey].total += Number(curr.amount);
    return acc;
  }, {});

  const sortedMonths = Object.values(groupedExpenses).sort((a, b) => b.id.localeCompare(a.id));
  const [expandedMonth, setExpandedMonth] = useState(null);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Expenses</h1>
        <p className="page-subtitle">Track your business expenditure</p>
      </div>

      <div className="card-panel">
        <div className="panel-header">
          <h2>{editingId ? 'Edit Expense' : 'Log Expense'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Date</label>
            <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
              {expenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Amount (₹)</label>
            <input type="number" className="form-control" min="1" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Description (Optional)</label>
            <input type="text" className="form-control" placeholder="E.g. Mechanic parts, grease, etc." value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="btn"><Plus size={18} /> {editingId ? 'Update Expense' : 'Save Expense'}</button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={() => {
                setEditingId(null); setAmount(''); setDesc(''); setDate(new Date().toISOString().split('T')[0]);
              }}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="card-panel">
        <div className="panel-header">
          <h2>Month-wise Expenses</h2>
        </div>
        <div>
          {sortedMonths.length === 0 ? (
            <p style={{textAlign: 'center', padding: '2rem', color: 'var(--text-muted)'}}>No expense records found.</p>
          ) : (
            sortedMonths.map((group, idx) => {
              const isExpanded = expandedMonth === group.id || (expandedMonth === null && idx === 0);
              
              return (
                <div key={group.id} style={{ marginBottom: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', overflow: 'hidden' }}>
                  <button 
                    type="button"
                    onClick={() => setExpandedMonth(isExpanded ? '' : group.id)}
                    style={{ 
                      width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      padding: '1rem 1.5rem', background: 'var(--panel-bg)', border: 'none', cursor: 'pointer',
                      borderBottom: isExpanded ? '1px solid var(--border-color)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {isExpanded ? <ChevronDown size={20} color="var(--text-muted)"/> : <ChevronRight size={20} color="var(--text-muted)"/>}
                      <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-light)' }}>{group.title}</h3>
                    </div>
                    <div style={{ fontWeight: 600, color: '#f87171', fontSize: '1.1rem' }}>
                      Total: ₹{group.total.toLocaleString()}
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div style={{overflowX: 'auto', background: 'rgba(0, 0, 0, 0.2)'}}>
                      <table style={{ margin: 0 }}>
                        <thead style={{ background: 'transparent' }}>
                          <tr>
                            <th>
                              Date 
                              <button 
                                type="button"
                                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')} 
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginLeft: '6px', verticalAlign: 'middle' }}
                                title="Sort by date"
                              >
                                <ArrowUpDown size={14} />
                              </button>
                            </th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.items.sort((a,b) => sortOrder === 'desc' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)).map(ex => (
                            <tr key={ex.id}>
                              <td data-label="Date">{ex.date && format(new Date(ex.date), 'dd-MMM-yy').toLowerCase()}</td>
                              <td data-label="Category"><span className="badge badge-blue">{ex.category}</span></td>
                              <td data-label="Description" style={{color: 'var(--text-muted)'}}>{ex.description || '-'}</td>
                              <td data-label="Amount" style={{fontWeight: 600}} className="text-danger">₹{ex.amount.toLocaleString()}</td>
                              <td data-label="Actions">
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button type="button" onClick={() => handleEditClick(ex)} className="btn btn-secondary" style={{ padding: '0.4rem', border: 'none', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }} title="Edit"><Pencil size={14} /></button>
                                  <button type="button" onClick={() => handleDeleteClick(ex.id)} className="btn btn-secondary" style={{ padding: '0.4rem', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }} title="Delete"><Trash2 size={14} /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })
          )}
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
