import React, { useMemo } from 'react';
import { Shield, MapPin, PieChart as PieChartIcon, Star } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { calculateConfidence } from '../utils/riskScore';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StoreTrustDashboard({ stores, inventory }) {
  
  const riskStats = useMemo(() => {
    let high = 0, medium = 0, low = 0;
    if (!inventory) return { high: 0, medium: 0, low: 0 };
    
    inventory.forEach(inv => {
      const store = stores.find(s => s.id === inv.storeId);
      if (!store) return;
      const conf = calculateConfidence(inv.lastUpdatedHours, store.cancelRate, inv.salesSpeed, inv.statedStock);
      if (conf === 'High') high++;
      else if (conf === 'Medium') medium++;
      else low++;
    });
    return { high, medium, low };
  }, [inventory, stores]);

  const totalInv = riskStats.high + riskStats.medium + riskStats.low;

  const doughnutData = {
    labels: ['High Confidence', 'Medium Confidence', 'Low Confidence (Risk)'],
    datasets: [{
      data: [riskStats.high, riskStats.medium, riskStats.low],
      backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(244, 63, 94, 0.8)'],
      borderColor: ['#10b981', '#f59e0b', '#f43f5e'],
      borderWidth: 1,
    }],
  };

  const doughnutOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: '#f8fafc', font: { family: 'Inter', size: 13 } } },
      tooltip: { backgroundColor: '#1e293b', titleFont: { family: 'Inter' }, bodyFont: { family: 'Inter', size: 14 } }
    },
    cutout: '70%'
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
      <div className="card" style={{borderTop: '4px solid var(--primary)', display: 'flex', gap: '3rem', alignItems: 'center'}}>
        <div style={{flex: 1}}>
          <div className="flex-gap" style={{marginBottom: '0.5rem'}}>
            <PieChartIcon size={24} color="var(--primary)" />
            <h2 style={{margin: 0}}>Global Inventory Risk</h2>
          </div>
          <p className="text-muted" style={{marginBottom: '1.5rem'}}>Real-time breakdown of all {totalInv.toLocaleString()} active inventory records across all 12 global hubs.</p>
          
          <div className="grid-cards" style={{gap: '1rem'}}>
            <div style={{background: 'var(--bg-dark)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(16,185,129,0.3)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'}}>
              <div className="text-muted" style={{fontSize: '0.85rem'}}>High Confidence (Safe)</div>
              <div style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)'}}>{((riskStats.high / totalInv) * 100).toFixed(1)}%</div>
            </div>
            <div style={{background: 'var(--bg-dark)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(244,63,94,0.3)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'}}>
              <div className="text-muted" style={{fontSize: '0.85rem'}}>Low Confidence (Risk)</div>
              <div style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--danger)'}}>{((riskStats.low / totalInv) * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>
        <div style={{flex: 1, height: '250px', position: 'relative', display: 'flex', justifyContent: 'center'}}>
           <Doughnut data={doughnutData} options={doughnutOptions} />
           <div style={{position: 'absolute', top: '50%', left: '25%', transform: 'translateY(-50%)', textAlign: 'center'}}>
              <span style={{display: 'block', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)'}}>{totalInv}</span>
              <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>SKUs</span>
           </div>
        </div>
      </div>

      <div className="card">
        <div className="flex-gap" style={{marginBottom: '0.5rem'}}>
          <Shield size={24} color="var(--primary)" />
          <h2 style={{margin: 0}}>Store Trust Matrix</h2>
        </div>
        <p className="text-muted" style={{marginBottom: '2rem'}}>Real-time performance metrics and customer satisfaction across 12 global fulfillment hubs.</p>
        
        <div style={{overflowX: 'auto'}}>
          <table>
            <thead>
              <tr>
                <th style={{paddingBottom: '1rem'}}>Fulfillment Hub</th>
                <th style={{paddingBottom: '1rem'}}>Location</th>
                <th style={{paddingBottom: '1rem', width: '15%'}}>Fulfillment Score</th>
                <th style={{paddingBottom: '1rem', width: '15%'}}>Update Frequency</th>
                <th style={{paddingBottom: '1rem', textAlign: 'right'}}>Cancel Rate</th>
                <th style={{paddingBottom: '1rem', textAlign: 'center'}}>Customer Rating</th>
                <th style={{paddingBottom: '1rem', textAlign: 'right'}}>Trust Score</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store, i) => {
                const rating = (store.trustScore / 20).toFixed(1);
                
                return (
                  <tr key={store.id} style={{background: i % 2 === 0 ? 'var(--surface)' : 'var(--bg-dark)', transition: '0.2s'}} className="card-hover">
                    <td style={{fontWeight: 600, padding: '1.25rem 1rem'}}>{store.name}</td>
                    <td style={{padding: '1.25rem 1rem'}}>
                      <div className="flex-gap" style={{gap: '0.5rem', color: 'var(--text-muted)'}}>
                        <MapPin size={14}/> {store.city}
                      </div>
                    </td>
                    <td style={{padding: '1.25rem 1rem'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <div style={{width: '100%', background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px'}}>
                           <div style={{width: `${store.fulfillmentScore}%`, background: store.fulfillmentScore > 80 ? 'var(--success)' : 'var(--warning)', height: '100%', borderRadius: '3px', boxShadow: '0 0 10px rgba(16,185,129,0.5)'}}></div>
                        </div>
                        <span style={{fontSize: '0.85rem', fontWeight: 600}}>{store.fulfillmentScore}</span>
                      </div>
                    </td>
                    <td style={{padding: '1.25rem 1rem'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <div style={{width: '100%', background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px'}}>
                           <div style={{width: `${store.updateFreqScore}%`, background: 'var(--primary)', height: '100%', borderRadius: '3px', boxShadow: '0 0 10px rgba(129,140,248,0.5)'}}></div>
                        </div>
                        <span style={{fontSize: '0.85rem', fontWeight: 600}}>{store.updateFreqScore}</span>
                      </div>
                    </td>
                    <td style={{textAlign: 'right', padding: '1.25rem 1rem', color: store.cancelRate > 0.15 ? 'var(--danger)' : 'var(--text-main)', fontWeight: 500}}>
                      {(store.cancelRate * 100).toFixed(1)}%
                    </td>
                    <td style={{textAlign: 'center', padding: '1.25rem 1rem'}}>
                      <div style={{display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(251, 191, 36, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '999px', border: '1px solid rgba(251, 191, 36, 0.2)'}}>
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        <span style={{color: 'var(--text-main)', fontWeight: 700, fontSize: '0.9rem'}}>{rating}</span>
                      </div>
                    </td>
                    <td style={{textAlign: 'right', padding: '1.25rem 1rem'}}>
                      <span className={`badge badge-${store.trustScore > 75 ? 'high' : (store.trustScore > 50 ? 'medium' : 'low')}`} style={{fontSize: '0.85rem', padding: '0.4rem 0.75rem'}}>
                        {store.trustScore}/100
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
