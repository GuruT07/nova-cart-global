import React, { useState } from 'react';
import { calculateConfidence } from '../utils/riskScore';
import { ShoppingCart, Search, MapPin, Sparkles, X, CheckCircle, Trash2, Plus, Minus, Filter } from 'lucide-react';

export default function CustomerApp({ data }) {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedCity, setSelectedCity] = useState('Bangalore');
  const [showCart, setShowCart] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [toast, setToast] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  
  const activeStore = data.stores.find(s => s.city === selectedCity);

  const getInventoryItem = (storeId, productId) => data.inventory.find(i => i.storeId === storeId && i.productId === productId);
  const getConfidence = (store, inventoryItem) => {
    if (!inventoryItem) return 'Low';
    return calculateConfidence(inventoryItem.lastUpdatedHours, store.cancelRate, inventoryItem.salesSpeed, inventoryItem.statedStock);
  };

  const allProductsData = data.products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .map(product => {
      const inv = getInventoryItem(activeStore.id, product.id);
      const confidence = getConfidence(activeStore, inv);
      
      let substituteProduct = null, nearbyStore = null;
      if (confidence === 'Low') {
        if (product.substituteId) {
          substituteProduct = data.products.find(p => p.id === product.substituteId);
          const substituteInv = getInventoryItem(activeStore.id, product.substituteId);
          if (getConfidence(activeStore, substituteInv) === 'Low') substituteProduct = null;
        }
        if (!substituteProduct) {
          nearbyStore = data.stores.find(s => s.city === selectedCity && s.id !== activeStore.id);
          if (nearbyStore) {
            const nearbyInv = getInventoryItem(nearbyStore.id, product.id);
            if (getConfidence(nearbyStore, nearbyInv) === 'Low') nearbyStore = null;
          }
        }
      }
      return { product, confidence, substituteProduct, nearbyStore };
    });

  const displayedProducts = allProductsData.filter(item => {
    if (filterStatus === 'Available') return item.confidence === 'High' || item.confidence === 'Medium';
    if (filterStatus === 'AI Rescue') return item.confidence === 'Low' && (item.substituteProduct || item.nearbyStore);
    if (filterStatus === 'Out of Stock') return item.confidence === 'Low' && !item.substituteProduct && !item.nearbyStore;
    return true;
  }).slice(0, 12);

  const handleAddToCart = (product, store, confidence, rescueData = null) => {
    const targetProduct = rescueData ? rescueData.product : product;
    const targetStore = rescueData ? rescueData.store : store;
    const targetConf = rescueData ? 'High (Rescued)' : confidence;

    setCart(prev => {
      const existing = prev.find(item => item.product.id === targetProduct.id && item.store.id === targetStore.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === targetProduct.id && item.store.id === targetStore.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { id: Math.random().toString(36).substr(2, 9), product: targetProduct, store: targetStore, confidence: targetConf, quantity: 1 }];
    });

    setToast(`Added ${targetProduct.name} to Cart`);
    setTimeout(() => setToast(null), 3000);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) setCart(prev => prev.filter(item => item.id !== id));
    else setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };
  const removeItem = (id) => setCart(prev => prev.filter(item => item.id !== id));
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const handleCheckout = () => {
    setCheckoutSuccess(true);
    setTimeout(() => { setCart([]); setCheckoutSuccess(false); setShowCart(false); }, 2000);
  };

  return (
    <div style={{position: 'relative'}}>
      {toast && (
        <div className="toast-animate" style={{
          position: 'fixed', bottom: '3rem', left: '50%', background: 'var(--success)', color: 'white', padding: '0.75rem 1.5rem',
          borderRadius: '999px', fontWeight: 600, zIndex: 100, boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
          display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}><CheckCircle size={18} /> {toast}</div>
      )}

      {showCart && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', justifyContent: 'flex-end'}}>
          <div style={{width: '450px', background: 'var(--surface-solid)', height: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 25px rgba(0,0,0,0.5)'}}>
            <div className="flex-between" style={{marginBottom: '2rem'}}>
              <h2 style={{margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem'}}><ShoppingCart size={24}/> Your Cart</h2>
              <button className="btn btn-outline" style={{padding: '0.5rem', borderRadius: '50%'}} onClick={() => setShowCart(false)}><X size={20}/></button>
            </div>
            {checkoutSuccess ? (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--success)', textAlign: 'center'}}>
                <CheckCircle size={64} style={{marginBottom: '1rem'}}/><h3>Order Placed Successfully!</h3><p className="text-muted">Simulated items have been routed to fulfillment.</p>
              </div>
            ) : cart.length === 0 ? (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)'}}>
                <ShoppingCart size={48} style={{opacity: 0.2, marginBottom: '1rem'}}/><p>Your cart is empty.</p>
              </div>
            ) : (
              <>
                <div style={{flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  {cart.map((item) => (
                    <div key={item.id} style={{background: 'var(--bg-dark)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)'}}>
                      <div className="flex-between" style={{marginBottom: '0.5rem'}}>
                        <h4 style={{margin: 0, fontSize: '1.05rem'}}>{item.product.name}</h4>
                        <button className="btn-outline" style={{padding: '0.2rem', color: 'var(--danger)', border: 'none', background: 'transparent', cursor: 'pointer'}} onClick={() => removeItem(item.id)}><Trash2 size={18}/></button>
                      </div>
                      <div style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>
                        Sourced from: <strong>{item.store.name}</strong> • <span className={`badge ${item.confidence.includes('High') ? 'badge-high' : (item.confidence === 'Medium' ? 'badge-medium' : 'badge-low')}`} style={{fontSize: '0.65rem', padding: '0.1rem 0.4rem'}}>{item.confidence}</span>
                      </div>
                      <div className="flex-between" style={{background: 'var(--surface)', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)'}}>
                        <div className="flex-gap" style={{gap: '0.5rem'}}>
                           <button className="btn btn-outline" style={{padding: '0.3rem', borderRadius: '0.25rem'}} onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14}/></button>
                           <span style={{fontWeight: 600, width: '20px', textAlign: 'center'}}>{item.quantity}</span>
                           <button className="btn btn-outline" style={{padding: '0.3rem', borderRadius: '0.25rem'}} onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14}/></button>
                        </div>
                        <span style={{fontWeight: 700, color: 'var(--primary)'}}>₹{item.product.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1.5rem'}}>
                  <div className="flex-between" style={{marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 700}}><span>Total:</span><span style={{color: 'var(--success)'}}>₹{cartTotal}</span></div>
                  <button className="btn" style={{width: '100%', padding: '1rem', fontSize: '1.1rem'}} onClick={handleCheckout}>Checkout Now</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hero Header Area */}
      <div style={{marginBottom: '3rem', padding: '2.5rem', background: 'var(--surface)', borderRadius: '1.5rem', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '2rem'}}>
        <div className="flex-between" style={{alignItems: 'flex-start'}}>
          <div>
             <h2 style={{margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2.2rem'}}><MapPin size={36} color="var(--primary)"/> {activeStore.name}</h2>
             <p className="text-muted" style={{marginTop: '0.5rem', fontSize: '1.15rem'}}>Real-time stock availability mapped to your local region.</p>
          </div>
          <div className="flex-gap" style={{alignItems: 'center'}}>
            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} style={{margin: 0, width: '220px', background: 'var(--bg-dark)', padding: '1.1rem 1.5rem', fontSize: '1.1rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)'}}>
              {['Bangalore', 'Mumbai', 'Delhi'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button className="btn" style={{background: 'var(--primary)', padding: '1.1rem 2.5rem', borderRadius: '999px', fontSize: '1.2rem', fontWeight: 700, boxShadow: '0 10px 25px rgba(99,102,241,0.4)'}} onClick={() => setShowCart(true)}>
              <ShoppingCart size={24} strokeWidth={2.5}/> <span style={{marginLeft: '0.5rem'}}>{cartCount} Items</span>
            </button>
          </div>
        </div>
        
        {/* Massive Search Bar Area */}
        <div className="flex-gap" style={{alignItems: 'center'}}>
          <div style={{position: 'relative', flex: 1, maxWidth: '850px'}}>
            <Search size={28} style={{position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)'}} />
            <input type="text" placeholder="Search 120+ items (e.g., Amul, Dolo)..." value={search} onChange={e => setSearch(e.target.value)} 
              style={{margin: 0, padding: '1.5rem 1.5rem 1.5rem 4.5rem', fontSize: '1.3rem', borderRadius: '999px', background: 'var(--bg-dark)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)'}} />
          </div>
          
          <div style={{background: 'var(--bg-dark)', padding: '0.5rem', borderRadius: '999px', display: 'flex', border: '1px solid var(--border)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'}}>
            {['All', 'Available', 'AI Rescue'].map(status => (
              <button key={status} onClick={() => setFilterStatus(status)} 
                style={{
                  padding: '0.8rem 1.5rem', borderRadius: '999px', border: 'none', 
                  background: filterStatus === status ? 'var(--primary)' : 'transparent', 
                  color: filterStatus === status ? 'white' : 'var(--text-muted)',
                  cursor: 'pointer', fontWeight: 600, fontSize: '1.05rem', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  boxShadow: filterStatus === status ? '0 4px 12px rgba(99,102,241,0.3)' : 'none'
                }}>
                {status === 'AI Rescue' && filterStatus === status && <Sparkles size={16}/>}
                {status === 'All' && filterStatus === status && <Filter size={16}/>}
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-cards">
        {displayedProducts.map(({ product, confidence, substituteProduct, nearbyStore }) => (
          <div key={product.id} className="card card-hover" style={{display: 'flex', flexDirection: 'column', padding: '1.5rem'}}>
            <div className="flex-between" style={{marginBottom: '1rem'}}>
              <span className="text-muted" style={{fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em'}}>{product.category}</span>
              <span className={`badge badge-${confidence.toLowerCase()}`}>{confidence}</span>
            </div>
            <h3 style={{fontSize: '1.15rem', color: 'var(--text-main)'}}>{product.name}</h3>
            <div style={{fontSize: '1.4rem', fontWeight: 700, margin: '1rem 0', color: 'var(--text-main)'}}>₹{product.price}</div>
            
            <div style={{marginTop: 'auto'}}>
              {confidence === 'Low' && (substituteProduct || nearbyStore) ? (
                <div className="alert-box" style={{padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px dashed var(--primary)'}}>
                  <div className="flex-gap" style={{color: 'var(--primary)', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.85rem'}}>
                    <Sparkles size={16} /> AI Rescue Activated
                  </div>
                  {substituteProduct && (
                     <div>
                       <p style={{fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)'}}>Substitute available:</p>
                       <button className="btn" style={{width: '100%', background: 'var(--surface-hover)'}} onClick={() => handleAddToCart(product, activeStore, confidence, {product: substituteProduct, store: activeStore})}>
                         Swap to {substituteProduct.name}
                       </button>
                     </div>
                  )}
                  {!substituteProduct && nearbyStore && (
                     <div>
                       <p style={{fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)'}}>Found at nearby {nearbyStore.name}:</p>
                       <button className="btn" style={{width: '100%', background: 'var(--surface-hover)'}} onClick={() => handleAddToCart(product, activeStore, confidence, {product, store: nearbyStore})}>
                         Source from Nearby
                       </button>
                     </div>
                  )}
                </div>
              ) : (
                <button className="btn btn-outline" style={{width: '100%', border: '1px solid var(--border)'}} onClick={() => handleAddToCart(product, activeStore, confidence)} disabled={confidence === 'Low'}>
                  {confidence === 'Low' ? 'Out of Stock' : 'Add to Cart'}
                </button>
              )}
            </div>
          </div>
        ))}
        {displayedProducts.length === 0 && (
          <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)'}}>
            <Filter size={48} style={{opacity: 0.2, marginBottom: '1rem', margin: '0 auto'}}/>
            <h3>No products match this filter</h3>
            <p>Try clearing your search or switching filter tabs.</p>
          </div>
        )}
      </div>
    </div>
  );
}
