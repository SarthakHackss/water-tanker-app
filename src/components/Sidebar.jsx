import React from 'react';
import { LayoutDashboard, Truck, ReceiptText, Users } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Profit Tracker', icon: <LayoutDashboard size={20} /> },
    { id: 'supply', label: 'Daily Supply', icon: <Truck size={20} /> },
    { id: 'expenses', label: 'Expenses', icon: <ReceiptText size={20} /> },
    { id: 'clients', label: 'Client Directory', icon: <Users size={20} /> },
    { id: 'autobill', label: 'Auto Bill', icon: <ReceiptText size={20} /> }
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <Truck size={24} />
        <span>TankerTrack</span>
      </div>
      <div className="nav-links">
        {navItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
