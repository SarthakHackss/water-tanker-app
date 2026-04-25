import React from 'react';
import { IndianRupee, TrendingDown, TrendingUp, Truck, CalendarDays } from 'lucide-react';

export default function Dashboard({ supplies, expenses, clients }) {
  const totalTankers = supplies.reduce((acc, curr) => acc + Number(curr.tankCount), 0);
  
  const totalRevenue = supplies.reduce((acc, curr) => {
    const client = clients.find(c => c.id === curr.clientId);
    return acc + (Number(curr.tankCount) * (client ? client.rate : 0));
  }, 0);

  const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const netProfit = totalRevenue - totalExpense;
  const totalDaysRan = new Set(supplies.map(s => s.date)).size;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Profit Tracker</h1>
        <p className="page-subtitle">Overview of your business financials</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><Truck size={24} /></div>
          <div className="stat-info">
            <h3>Total Tankers Supplied</h3>
            <div className="value">{totalTankers}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple" style={{background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7'}}><CalendarDays size={24} /></div>
          <div className="stat-info">
            <h3>Total Days Ran</h3>
            <div className="value">{totalDaysRan}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><TrendingUp size={24} /></div>
          <div className="stat-info">
            <h3>Total Revenue Earned</h3>
            <div className="value">₹{totalRevenue.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><TrendingDown size={24} /></div>
          <div className="stat-info">
            <h3>Total Expenses</h3>
            <div className="value">₹{totalExpense.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><IndianRupee size={24} /></div>
          <div className="stat-info">
            <h3>Net Profit</h3>
            <div className="value" style={{ color: netProfit >= 0 ? '#34d399' : '#f87171' }}>
              ₹{netProfit.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
