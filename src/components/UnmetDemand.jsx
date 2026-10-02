import React from 'react';

export default function UnmetDemand({ searches }) {
  return (
    <div className="card">
      <h2>Unmet Demand Radar</h2>
      <p className="text-muted">Highly searched items currently out of stock locally.</p>
      
      <div className="grid-cards" style={{marginTop: '1rem'}}>
        {searches.map((s, i) => (
          <div key={i} style={{background: 'var(--bg-dark)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)'}}>
            <h3 style={{fontSize: '1.1rem'}}>{s.query}</h3>
            <div className="flex-between" style={{marginTop: '0.5rem'}}>
              <span className="text-muted">{s.count} missed queries</span>
              <span style={{color: 'var(--warning)', fontWeight: 600}}>{s.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}