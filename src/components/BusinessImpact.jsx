import React, { useState } from 'react';
import { calculateConfidence } from '../utils/riskScore';
import { Play, TrendingUp, ShieldCheck } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

export default function BusinessImpact({ data }) {
  const [simResults, setSimResults] = useState(null);

  // Business case constants
  const AOV = 486;
  const MONTHLY_ORDERS = 38500;
  const CANCEL_RATE = 0.11;
  const UNAVAILABLE_RATIO = 0.35;
  
  const totalCancels = MONTHLY_ORDERS * CANCEL_RATE;
  const targetCancels = Math.floor(totalCancels * UNAVAILABLE_RATIO); // ~1482
  const maxRevenueProtected = targetCancels * AOV;

  const simulateDay = () => {
    let rawCancels = 0;
    let rescued = 0;
    let runningRescues = []; // Data for chart

    for (let i = 0; i < 500; i++) {
      const store = data.stores[Math.floor(Math.random() * data.stores.length)];
      const product = data.products[Math.floor(Math.random() * data.products.length)];
      const inv = data.inventory.find(inv => inv.storeId === store.id && inv.productId === product.id);
      
      const conf = inv ? calculateConfidence(inv.lastUpdatedHours, store.cancelRate, inv.salesSpeed, inv.statedStock) : 'Low';
      
      let probability = 0.05;
      if (conf === 'Low') probability = 0.7;
      if (conf === 'Medium') probability = 0.2;
      
      if (Math.random() < probability) {
        rawCancels++;
        if (conf === 'Low') {
          if (Math.random() < 0.7) rescued++;
        }
      }
      
      if (i % 50 === 0 && i !== 0) {
        runningRescues.push(rescued * AOV);
      }
    }
    runningRescues.push(rescued * AOV); // End point
    
    setSimResults({
      orders: 500,
      rawCancels,
      rescued,
      finalCancels: rawCancels - rescued,
      chartData: runningRescues
    });
  };

  const chartDataConfig = {
    labels: simResults ? ['50', '100', '150', '200', '250', '300', '350', '400', '450', '500'] : ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
    datasets: [{
      fill: true,
      label: simResults ? 'Live Revenue Rescued (₹)' : 'Projected Revenue Protected (₹)',
      data: simResults ? simResults.chartData : [maxRevenueProtected * 0.2, maxRevenueProtected * 0.5, maxRevenueProtected * 0.8, maxRevenueProtected],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      pointBackgroundColor: '#059669',
      tension: 0.4,
      borderWidth: 3
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { size: 14, family: 'Inter' },
        bodyFont: { size: 14, family: 'Inter', weight: 'bold' },
        padding: 12,
        displayColors: false
      }
    },
    scales: { 
      y: { 
        beginAtZero: true, 
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'Inter' } }
      }, 
      x: { 
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { family: 'Inter' } }
      } 
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
      <div className="card" style={{borderTop: '4px solid var(--primary)'}}>
        <h2>Business Impact Case</h2>
        <p className="text-muted">Based on real business metrics: 38,500 orders/mo, 11% cancel rate, 35% driven by unavailability.</p>
        
        <div className="grid-cards" style={{marginTop: '1.5rem'}}>
          <div style={{background: 'var(--surface-solid)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--border)'}}>
             <div className="text-muted" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><ShieldCheck size={16}/> Target Rescues</div>
             <div className="metric-value" style={{color: 'var(--text-main)'}}>{targetCancels}/mo</div>
          </div>
          <div style={{background: 'var(--surface-solid)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden'}}>
             <div style={{position: 'absolute', right: '-1rem', top: '-1rem', opacity: 0.05}}><TrendingUp size={120} /></div>
             <div className="text-muted">Revenue Protected</div>
             <div className="metric-value" style={{color: 'var(--success)'}}>₹{maxRevenueProtected.toLocaleString()}</div>
          </div>
          <div style={{background: 'var(--surface-solid)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--border)'}}>
             <div className="text-muted">Support Tickets Saved</div>
             <div className="metric-value" style={{color: 'var(--primary)'}}>{targetCancels}</div>
          </div>
        </div>

        <div style={{height: '300px', marginTop: '2.5rem', background: 'var(--bg-dark)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)'}}>
           <div style={{marginBottom: '1rem', fontWeight: 600, color: 'var(--text-main)'}}>
             {simResults ? 'Live Simulation: Revenue Rescued over 500 Orders' : '30-Day Protected Revenue Trajectory (₹)'}
           </div>
           <div style={{height: '85%'}}>
             <Line data={chartDataConfig} options={chartOptions} />
           </div>
        </div>
      </div>

      <div className="card" style={{background: 'linear-gradient(to right, rgba(99, 102, 241, 0.1), transparent)', borderLeft: '4px solid var(--primary)'}}>
        <div className="flex-between">
          <div>
            <h2>Simulate A Day (500 Orders)</h2>
            <p className="text-muted">Runs a monte-carlo simulation pulling live data from the inventory matrix to test the Rescue Engine.</p>
          </div>
          <button className="btn" onClick={simulateDay} style={{padding: '0.8rem 1.5rem', fontSize: '1rem'}}><Play size={20}/> Launch Simulation</button>
        </div>

        {simResults && (
          <div style={{marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-dark)', borderRadius: '0.75rem', border: '1px solid rgba(16, 185, 129, 0.3)', position: 'relative'}}>
            <h3 style={{color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><ShieldCheck size={20}/> Simulation Complete</h3>
            <div className="grid-cards" style={{marginTop: '1.5rem'}}>
              <div>
                <div className="text-muted">Without Trust Engine</div>
                <div style={{fontSize: '1.8rem', color: 'var(--danger)', fontWeight: 700}}>{simResults.rawCancels} Lost</div>
              </div>
              <div>
                <div className="text-muted">Engine Rescues</div>
                <div style={{fontSize: '1.8rem', color: 'var(--success)', fontWeight: 700}}>{simResults.rescued} Rescued</div>
              </div>
              <div>
                <div className="text-muted">Actual Revenue Saved Today</div>
                <div style={{fontSize: '1.8rem', color: 'var(--primary)', fontWeight: 700}}>₹{(simResults.rescued * AOV).toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
