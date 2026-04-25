import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DailySupply from './components/DailySupply';
import Expenses from './components/Expenses';
import Billing from './components/Billing';
import AutoBill from './components/AutoBill';
import { initialClients, initialSupplies, initialExpenses } from './mockData';
import { db } from './firebase';
import { collection, onSnapshot, setDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [clients, setClients] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('tanker_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Boot up Realtime Database Sync
  useEffect(() => {
    // Live Subscribe to Collections
    const unsubClients = onSnapshot(collection(db, "clients"), (snap) => {
      setClients(snap.docs.map(d => ({ ...d.data(), id: Number(d.id) })));
    }, (error) => setDbError(error.message));
    
    const unsubSupplies = onSnapshot(collection(db, "supplies"), (snap) => {
      setSupplies(snap.docs.map(d => ({ ...d.data(), id: Number(d.id) })));
    }, (error) => setDbError(error.message));
    
    const unsubExpenses = onSnapshot(collection(db, "expenses"), (snap) => {
      setExpenses(snap.docs.map(d => ({ ...d.data(), id: Number(d.id) })));
    }, (error) => setDbError(error.message));

    // Check if the cloud database is brand new/empty. If so, automatically teleport all our Google Sheets data up to the cloud!
    const seedDatabaseIfEmpty = async () => {
      try {
        const snap = await getDocs(collection(db, "clients"));
        if (snap.empty) {
           console.log("Empty Cloud Library detected. Pushing all Google Sheets data to Firebase Cloud...");
           initialClients.forEach(c => setDoc(doc(db, "clients", String(c.id)), c));
           initialSupplies.forEach(s => setDoc(doc(db, "supplies", String(s.id)), s));
           initialExpenses.forEach(e => setDoc(doc(db, "expenses", String(e.id)), e));
        }
        setDbLoading(false);
      } catch (err) {
        setDbError(err.message + " | Did you definitely click 'Create Database' inside the Firestore tab?");
      }
    };
    
    seedDatabaseIfEmpty();

    return () => {
      unsubClients();
      unsubSupplies();
      unsubExpenses();
    };
  }, []);

  // Firebase Real-time Write Functions
  const addSupply = async (supply) => await setDoc(doc(db, "supplies", String(supply.id)), supply);
  const editSupply = async (supply) => await setDoc(doc(db, "supplies", String(supply.id)), supply);
  const deleteSupply = async (id) => await deleteDoc(doc(db, "supplies", String(id)));
  
  const addExpense = async (expense) => await setDoc(doc(db, "expenses", String(expense.id)), expense);
  const editExpense = async (expense) => await setDoc(doc(db, "expenses", String(expense.id)), expense);
  const deleteExpense = async (id) => await deleteDoc(doc(db, "expenses", String(id)));

  const addClient = async (client) => await setDoc(doc(db, "clients", String(client.id)), client);
  const editClient = async (client) => await setDoc(doc(db, "clients", String(client.id)), client);
  const deleteClient = async (id) => await deleteDoc(doc(db, "clients", String(id)));

  if (dbError) {
    return <div style={{display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', color: '#f87171', flexDirection: 'column', padding: '2rem', textAlign: 'center'}}><h2>Firebase Connection Error</h2><p>{dbError}</p></div>;
  }

  if (dbLoading) {
    return <div style={{display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', color: '#60a5fa', flexDirection: 'column'}}><h2>Connecting to Firebase Cloud...</h2><p>Please wait...</p></div>;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'Shivshambhu@123') {
      setIsAuthenticated(true);
      localStorage.setItem('tanker_auth', 'true');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '2rem', background: 'var(--bg-main)'}}>
        <div className="card-panel" style={{maxWidth: '400px', width: '100%', textAlign: 'center', padding: '2rem'}}>
          <h2 style={{marginBottom: '1.5rem', color: 'var(--text-main)', lineHeight: '1.4'}}>
            Shivshambhu Jalpuravtha<br/>
            <span style={{fontSize: '16px', color: 'var(--text-muted)', fontWeight: 'normal'}}>Admin Login</span>
          </h2>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Enter Password" 
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              style={{marginBottom: '1rem', width: '100%', textAlign: 'center'}}
              autoFocus
            />
            {loginError && <p style={{color: '#f87171', marginBottom: '1rem', fontSize: '14px'}}>Incorrect password</p>}
            <button type="submit" className="btn" style={{width: '100%', justifyContent: 'center'}}>Secure Login</button>
          </form>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('tanker_auth');
    setPasswordInput('');
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard supplies={supplies} expenses={expenses} clients={clients} />}
        {activeTab === 'supply' && <DailySupply supplies={supplies} clients={clients} onAddSupply={addSupply} onEditSupply={editSupply} onDeleteSupply={deleteSupply} />}
        {activeTab === 'expenses' && <Expenses expenses={expenses} onAddExpense={addExpense} onEditExpense={editExpense} onDeleteExpense={deleteExpense} />}
        {activeTab === 'clients' && <Billing clients={clients} onAddClient={addClient} onEditClient={editClient} onDeleteClient={deleteClient} />}
        {activeTab === 'autobill' && <AutoBill clients={clients} supplies={supplies} />}
      </main>
      
      <button 
        onClick={handleLogout}
        className="no-print logout-btn"
      >
        Logout
      </button>
    </div>
  );
}

export default App;
