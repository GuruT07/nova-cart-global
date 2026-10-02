import React, { useState, useEffect } from 'react';
import { LineChart, Users, Store, Loader2, Sparkles } from 'lucide-react';
import CustomerApp from './components/CustomerApp';
import StoreTrustDashboard from './components/StoreTrustDashboard';
import BusinessImpact from './components/BusinessImpact';
import UnmetDemand from './components/UnmetDemand';
import './index.css';

const NovaLogo = () => (
  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'block'}}>
    <path d="M20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20C0 8.95431 8.95431 0 20 0Z" fill="url(#paint0_linear)"/>
    <path d="M11 20L20 11L29 20L20 29L11 20Z" fill="#09090b"/>
    <circle cx="20" cy="20" r="3.5" fill="url(#paint0_linear)"/>
    <defs>
      <linearGradient id="paint0_linear" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff"/>
        <stop offset="1" stopColor="#e4e4e7"/>
      </linearGradient>
    </defs>
  </svg>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('customer');
  const [data, setData] = useState(null);

  useEffect(() => {
    import('./data.json')
      .then((module) => setData(module.default))
      .catch((err) => console.error("Could not load data.json. Run 'npm run seed'.", err));
  }, []);

  if (!data) return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--primary)'}}><Loader2 size={48} className="animate-spin" /></div>;

  return (
    <div className="container">
      {/* Skip-to-content link for keyboard / screen-reader users */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <header role="banner" className="flex-between" style={{marginBottom: '3rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)'}}>
        <div className="flex-gap">
          <div style={{background: 'linear-gradient(135deg, var(--primary), #a855f7)', padding: '0.6rem', borderRadius: '0.75rem', boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)'}}>
            <NovaLogo />
          </div>
          <div>
            <h1 style={{fontSize: '1.6rem', margin: 0}}>Nova Cart Global</h1>
            <div className="text-muted" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem'}}>
              <Sparkles size={14} color="var(--primary)" /> Smart Rescue Engine Simulator
            </div>
          </div>
        </div>
        
        {/* Modern Segmented Tab Control */}
        <nav role="navigation" aria-label="Main navigation" style={{background: 'var(--surface)', padding: '0.35rem', borderRadius: '0.75rem', display: 'flex', gap: '0.25rem', border: '1px solid var(--border)', backdropFilter: 'blur(10px)'}}>
          <button 
            onClick={() => setActiveTab('customer')} 
            style={{
              padding: '0.6rem 1.2rem', borderRadius: '0.5rem', border: 'none', 
              background: activeTab === 'customer' ? 'var(--surface-hover)' : 'transparent', 
              color: activeTab === 'customer' ? 'var(--text-main)' : 'var(--text-muted)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontWeight: 500, transition: 'all 0.2s ease',
              boxShadow: activeTab === 'customer' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
            }}>
            <Users size={18} color={activeTab === 'customer' ? 'var(--primary)' : 'currentColor'} /> Customer App
          </button>
          
          <button 
            onClick={() => setActiveTab('store')} 
            style={{
              padding: '0.6rem 1.2rem', borderRadius: '0.5rem', border: 'none', 
              background: activeTab === 'store' ? 'var(--surface-hover)' : 'transparent', 
              color: activeTab === 'store' ? 'var(--text-main)' : 'var(--text-muted)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontWeight: 500, transition: 'all 0.2s ease',
              boxShadow: activeTab === 'store' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
            }}>
            <Store size={18} color={activeTab === 'store' ? 'var(--primary)' : 'currentColor'} /> Store Trust Matrix
          </button>
          
          <button 
            onClick={() => setActiveTab('sim')} 
            style={{
              padding: '0.6rem 1.2rem', borderRadius: '0.5rem', border: 'none', 
              background: activeTab === 'sim' ? 'var(--surface-hover)' : 'transparent', 
              color: activeTab === 'sim' ? 'var(--text-main)' : 'var(--text-muted)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontWeight: 500, transition: 'all 0.2s ease',
              boxShadow: activeTab === 'sim' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
            }}>
            <LineChart size={18} color={activeTab === 'sim' ? 'var(--primary)' : 'currentColor'} /> Business Impact & Sim
          </button>
        </nav>
      </header>

      <main id="main-content" role="main">
        {activeTab === 'customer' && <CustomerApp data={data} />}
        {activeTab === 'sim' && <BusinessImpact data={data} />}
        {activeTab === 'store' && (
          <div style={{display: 'flex', gap: '2rem', flexDirection: 'column'}}>
            <StoreTrustDashboard stores={data.stores} inventory={data.inventory} />
            <UnmetDemand searches={data.unmetSearches} />
          </div>
        )}
      </main>
    </div>
  );
}
