import React, { useState, useMemo, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { calculateConfidence, sanitizeInput } from '../utils/riskScore';
import { MAX_PRODUCTS_SHOWN } from '../utils/constants';
import { ShoppingCart, Search, MapPin, Sparkles, CheckCircle, Filter } from 'lucide-react';
import ProductCard from './ProductCard';

// Lazy-load CartDrawer — only pulls in the JS bundle when the cart is opened
const CartDrawer = lazy(() => import('./CartDrawer'));

export default function CustomerApp({ data }) {
  const [search, setSearch]               = useState('');
  const [cart, setCart]                   = useState([]);
  const [selectedCity, setSelectedCity]   = useState('Bangalore');
  const [showCart, setShowCart]           = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [toast, setToast]                 = useState(null);
  const [filterStatus, setFilterStatus]   = useState('All');

  const activeStore = useMemo(
    () => data.stores.find(s => s.city === selectedCity),
    [data.stores, selectedCity],
  );

  const getInventoryItem = (storeId, productId) =>
    data.inventory.find(i => i.storeId === storeId && i.productId === productId);

  const getConfidence = (store, inventoryItem) => {
    if (!inventoryItem) return 'Low';
    return calculateConfidence(
      inventoryItem.lastUpdatedHours,
      store.cancelRate,
      inventoryItem.salesSpeed,
      inventoryItem.statedStock,
    );
  };

  // Memoize the expensive product-mapping computation
  const allProductsData = useMemo(() => {
    return data.products
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      .map(product => {
        const inv        = getInventoryItem(activeStore.id, product.id);
        const confidence = getConfidence(activeStore, inv);

        let substituteProduct = null;
        let nearbyStore       = null;

        if (confidence === 'Low') {
          if (product.substituteId) {
            substituteProduct = data.products.find(p => p.id === product.substituteId);
            const subInv = getInventoryItem(activeStore.id, product.substituteId);
            if (getConfidence(activeStore, subInv) === 'Low') substituteProduct = null;
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
  }, [data.products, data.inventory, data.stores, activeStore, search, selectedCity]);

  const displayedProducts = useMemo(() => {
    return allProductsData
      .filter(item => {
        if (filterStatus === 'Available')  return item.confidence !== 'Low';
        if (filterStatus === 'AI Rescue')  return item.confidence === 'Low' && (item.substituteProduct || item.nearbyStore);
        return true;
      })
      .slice(0, MAX_PRODUCTS_SHOWN);
  }, [allProductsData, filterStatus]);

  const handleAddToCart = (product, store, confidence, rescueData = null) => {
    const targetProduct = rescueData ? rescueData.product : product;
    const targetStore   = rescueData ? rescueData.store   : store;
    const targetConf    = rescueData ? 'High (Rescued)'   : confidence;

    setCart(prev => {
      const existing = prev.find(
        item => item.product.id === targetProduct.id && item.store.id === targetStore.id,
      );
      if (existing) {
        return prev.map(item =>
          item.product.id === targetProduct.id && item.store.id === targetStore.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        product: targetProduct,
        store: targetStore,
        confidence: targetConf,
        quantity: 1,
      }];
    });

    setToast(`Added ${targetProduct.name} to Cart`);
    setTimeout(() => setToast(null), 3000);
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) setCart(prev => prev.filter(item => item.id !== id));
    else setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    setTimeout(() => { setCart([]); setCheckoutSuccess(false); setShowCart(false); }, 2000);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ position: 'relative' }}>
      {/* Toast notification */}
      {toast && (
        <div
          className="toast-animate"
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed', bottom: '3rem', left: '50%',
            background: 'var(--success)', color: 'white', padding: '0.75rem 1.5rem',
            borderRadius: '999px', fontWeight: 600, zIndex: 100,
            boxShadow: '0 10px 25px rgba(16,185,129,0.4)',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}
        >
          <CheckCircle size={18} aria-hidden="true" /> {toast}
        </div>
      )}

      {/* Cart drawer — lazy loaded */}
      {showCart && (
        <Suspense fallback={null}>
          <CartDrawer
            cart={cart}
            onClose={() => setShowCart(false)}
            onUpdateQuantity={updateQuantity}
            onRemove={id => setCart(prev => prev.filter(item => item.id !== id))}
            onCheckout={handleCheckout}
            checkoutSuccess={checkoutSuccess}
          />
        </Suspense>
      )}

      {/* Hero header */}
      <div style={{ marginBottom: '3rem', padding: '2.5rem', background: 'var(--surface)', borderRadius: '1.5rem', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="flex-between" style={{ alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2.2rem' }}>
              <MapPin size={36} color="var(--primary)" aria-hidden="true" /> {activeStore.name}
            </h2>
            <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '1.15rem' }}>
              Real-time stock availability mapped to your local region.
            </p>
          </div>
          <div className="flex-gap" style={{ alignItems: 'center' }}>
            <label htmlFor="city-select" className="sr-only">Select city</label>
            <select
              id="city-select"
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              style={{ margin: 0, width: '220px', background: 'var(--bg-dark)', padding: '1.1rem 1.5rem', fontSize: '1.1rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {['Bangalore', 'Mumbai', 'Delhi'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              className="btn"
              style={{ background: 'var(--primary)', padding: '1.1rem 2.5rem', borderRadius: '999px', fontSize: '1.2rem', fontWeight: 700, boxShadow: '0 10px 25px rgba(99,102,241,0.4)' }}
              onClick={() => setShowCart(true)}
              aria-label={`Open cart with ${cartCount} items`}
            >
              <ShoppingCart size={24} strokeWidth={2.5} aria-hidden="true" />
              <span style={{ marginLeft: '0.5rem' }}>{cartCount} Items</span>
            </button>
          </div>
        </div>

        {/* Search + Filter bar */}
        <div className="flex-gap" style={{ alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '850px' }}>
            <Search size={28} style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} aria-hidden="true" />
            <input
              type="search"
              id="product-search"
              placeholder="Search 120+ items (e.g., Amul, Dolo)..."
              value={search}
              onChange={e => setSearch(sanitizeInput(e.target.value))}
              aria-label="Search products"
              style={{ margin: 0, padding: '1.5rem 1.5rem 1.5rem 4.5rem', fontSize: '1.3rem', borderRadius: '999px', background: 'var(--bg-dark)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}
            />
          </div>

          <div
            role="group"
            aria-label="Filter products by availability"
            style={{ background: 'var(--bg-dark)', padding: '0.5rem', borderRadius: '999px', display: 'flex', border: '1px solid var(--border)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}
          >
            {['All', 'Available', 'AI Rescue'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                aria-pressed={filterStatus === status}
                style={{
                  padding: '0.8rem 1.5rem', borderRadius: '999px', border: 'none',
                  background: filterStatus === status ? 'var(--primary)' : 'transparent',
                  color: filterStatus === status ? 'white' : 'var(--text-muted)',
                  cursor: 'pointer', fontWeight: 600, fontSize: '1.05rem', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  boxShadow: filterStatus === status ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
                }}
              >
                {status === 'AI Rescue' && filterStatus === status && <Sparkles size={16} aria-hidden="true" />}
                {status === 'All' && filterStatus === status && <Filter size={16} aria-hidden="true" />}
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <section aria-label="Product listings">
        <div className="grid-cards">
          {displayedProducts.map(({ product, confidence, substituteProduct, nearbyStore }) => (
            <ProductCard
              key={product.id}
              product={product}
              confidence={confidence}
              substituteProduct={substituteProduct}
              nearbyStore={nearbyStore}
              activeStore={activeStore}
              onAddToCart={handleAddToCart}
            />
          ))}
          {displayedProducts.length === 0 && (
            <div
              style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}
              role="status"
            >
              <Filter size={48} style={{ opacity: 0.2, marginBottom: '1rem', margin: '0 auto' }} aria-hidden="true" />
              <h3>No products match this filter</h3>
              <p>Try clearing your search or switching filter tabs.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

CustomerApp.propTypes = {
  data: PropTypes.shape({
    stores:    PropTypes.array.isRequired,
    products:  PropTypes.array.isRequired,
    inventory: PropTypes.array.isRequired,
  }).isRequired,
};
