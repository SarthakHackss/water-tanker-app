import React, { useState } from 'react';
import { Filter, Download, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';

export default function AutoBill({ clients, supplies }) {
  const [billClientId, setBillClientId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [supplySort, setSupplySort] = useState('asc');

  const filteredSupplies = supplies.filter(s => {
    if (!billClientId) return false;
    if (s.clientId !== Number(billClientId)) return false;
    if (startDate && new Date(s.date) < new Date(startDate)) return false;
    if (endDate && new Date(s.date) > new Date(endDate)) return false;
    return true;
  });

  const totalBilledTankers = filteredSupplies.reduce((acc, curr) => acc + curr.tankCount, 0);
  const selectedClient = clients.find(c => c.id === Number(billClientId));
  const totalBilledAmount = totalBilledTankers * (selectedClient?.rate || 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Auto Billing System</h1>
        <p className="page-subtitle">Generate automated reports and invoices for clients</p>
      </div>

      <div className="card-panel" id="invoice">
        <div className="panel-header">
          <h2>Generate Invoice Filter</h2>
        </div>
        <div className="form-grid" style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <label>Select Client</label>
            <select className="form-control" value={billClientId} onChange={e => setBillClientId(e.target.value)}>
              <option value="">Choose a client...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>

        {selectedClient && (
          <>
            {/* UI Summary Content (Hidden on Print) */}
            <div className="no-print" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ marginBottom: '0.5rem', color: '#60a5fa' }}>Billing Summary for {selectedClient.name}</h3>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Total Tankers:</span> <strong style={{ fontSize: '1.25rem' }}>{totalBilledTankers}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Total Amount Due:</span> <strong style={{ fontSize: '1.25rem', color: '#34d399' }}>₹{totalBilledAmount.toLocaleString()}</strong></div>
                </div>
              </div>
              <button className="btn" onClick={() => window.print()}><Download size={18} /> Print Invoice</button>
            </div>

            {/* Print Exclusive Content (Hidden on Screen) */}
            <div className="print-only print-header-container">
              <img src="/header.png" alt="Header" style={{ width: '100%', marginBottom: '20px' }} />
              
              <div className="print-summary-grid">
                <div className="print-row">
                  <span className="print-label">Client Name</span>
                  <span className="print-val"><strong>{selectedClient.name}</strong></span>
                </div>
                <div className="print-row">
                  <span className="print-label">Start Date</span>
                  <span className="print-val"><strong>{startDate ? format(new Date(startDate), 'dd-MMM-yy') : 'All Time'}</strong></span>
                </div>
                <div className="print-row">
                  <span className="print-label">End Date</span>
                  <span className="print-val"><strong>{endDate ? format(new Date(endDate), 'dd-MMM-yy') : 'All Time'}</strong></span>
                </div>
                
                <div style={{height: '25px'}}></div>

                <div className="print-row">
                  <span className="print-label">TOTAL TANKERS<br/>SUPPLIED</span>
                  <span className="print-val"><strong>{totalBilledTankers}</strong></span>
                </div>
                <div style={{height: '10px'}}></div>
                <div className="print-row">
                  <span className="print-label">TOTAL AMOUNT DUE</span>
                  <span className="print-val"><strong>{totalBilledAmount}</strong></span>
                </div>
              </div>
            </div>

            <div style={{overflowX: 'auto'}}>
              <table className="print-table">
                <thead>
                  <tr>
                    <th>
                      DATE
                      <button 
                        type="button"
                        className="no-print"
                        onClick={() => setSupplySort(supplySort === 'asc' ? 'desc' : 'asc')} 
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginLeft: '6px', verticalAlign: 'middle' }}
                        title="Sort by date"
                      >
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th>COMPANY</th>
                    <th>LOCATION</th>
                    <th>NO OF<br/>TANKERS</th>
                    <th>RATE</th>
                    <th>TOTAL<br/>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSupplies.map(s => s).sort((a,b) => supplySort === 'desc' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)).map(s => {
                    const total = s.tankCount * selectedClient.rate;
                    return (
                      <tr key={s.id}>
                        <td data-label="Date" style={{textAlign: 'center'}}>{s.date && format(new Date(s.date), 'dd-MM-yyyy')}</td>
                        <td data-label="Company" style={{textAlign: 'center'}}>
                          <span className="print-strip-bg" style={{ 
                            background: selectedClient.color || 'transparent', 
                            color: selectedClient.color ? '#000' : 'var(--text-main)', 
                            padding: selectedClient.color ? '4px 8px' : '0', 
                            borderRadius: '4px', 
                            fontWeight: selectedClient.color ? 'bold' : 'normal',
                            display: 'inline-block'
                          }}>
                            {selectedClient.name}
                          </span>
                        </td>
                        <td data-label="Location" style={{textAlign: 'center'}}>{selectedClient.location}</td>
                        <td data-label="No of Tankers" style={{textAlign: 'center'}}><span className="print-clean-badge">{s.tankCount}</span></td>
                        <td data-label="Rate" style={{textAlign: 'center'}}>{selectedClient.rate}</td>
                        <td data-label="Total Amount" style={{textAlign: 'center', fontWeight: 600}}>{total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="print-only signature-block" style={{ marginTop: 'auto', paddingTop: '60px', width: '100%', display: 'flex', justifyContent: 'flex-end', paddingRight: '10px' }}>
              <div style={{ textAlign: 'center', color: '#000', fontFamily: 'Arial, sans-serif' }}>
                <p style={{ marginBottom: '60px', fontWeight: 'bold', fontSize: '14px' }}>Authorized Signatory</p>
                <p style={{ fontWeight: 'bold', fontSize: '16px', letterSpacing: '0.5px' }}>Bhagirath Patil</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
