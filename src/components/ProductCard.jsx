import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Sparkles } from 'lucide-react';

/**
 * ProductCard — displays a single product with confidence badge and CTA.
 * Wrapped in React.memo to prevent re-renders when parent state changes
 * (e.g. cart updates) don't affect this card's props.
 */
const ProductCard = memo(function ProductCard({
  product,
  confidence,
  substituteProduct,
  nearbyStore,
  activeStore,
  onAddToCart,
}) {
  return (
    <article
      className="card card-hover"
      aria-label={`${product.name}, ₹${product.price}, ${confidence} availability`}
      style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}
    >
      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <span
          className="text-muted"
          style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
        >
          {product.category}
        </span>
        <span
          className={`badge badge-${confidence.toLowerCase()}`}
          aria-label={`Availability: ${confidence}`}
        >
          {confidence}
        </span>
      </div>

      <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>{product.name}</h3>
      <div style={{ fontSize: '1.4rem', fontWeight: 700, margin: '1rem 0', color: 'var(--text-main)' }}>
        ₹{product.price}
      </div>

      <div style={{ marginTop: 'auto' }}>
        {confidence === 'Low' && (substituteProduct || nearbyStore) ? (
          <div
            className="alert-box"
            role="alert"
            style={{ padding: '1rem', background: 'rgba(99,102,241,0.1)', border: '1px dashed var(--primary)' }}
          >
            <div className="flex-gap" style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.85rem' }}>
              <Sparkles size={16} aria-hidden="true" /> AI Rescue Activated
            </div>

            {substituteProduct && (
              <div>
                <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                  Substitute available:
                </p>
                <button
                  className="btn"
                  style={{ width: '100%', background: 'var(--surface-hover)' }}
                  aria-label={`Swap to ${substituteProduct.name}`}
                  onClick={() => onAddToCart(product, activeStore, confidence, { product: substituteProduct, store: activeStore })}
                >
                  Swap to {substituteProduct.name}
                </button>
              </div>
            )}

            {!substituteProduct && nearbyStore && (
              <div>
                <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                  Found at nearby {nearbyStore.name}:
                </p>
                <button
                  className="btn"
                  style={{ width: '100%', background: 'var(--surface-hover)' }}
                  aria-label={`Source ${product.name} from ${nearbyStore.name}`}
                  onClick={() => onAddToCart(product, activeStore, confidence, { product, store: nearbyStore })}
                >
                  Source from Nearby
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="btn btn-outline"
            style={{ width: '100%', border: '1px solid var(--border)' }}
            onClick={() => onAddToCart(product, activeStore, confidence)}
            disabled={confidence === 'Low'}
            aria-disabled={confidence === 'Low'}
            aria-label={confidence === 'Low' ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
          >
            {confidence === 'Low' ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}
      </div>
    </article>
  );
});

ProductCard.propTypes = {
  product:          PropTypes.shape({
    id:       PropTypes.number.isRequired,
    name:     PropTypes.string.isRequired,
    price:    PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
  confidence:       PropTypes.oneOf(['High', 'Medium', 'Low']).isRequired,
  substituteProduct: PropTypes.object,
  nearbyStore:       PropTypes.object,
  activeStore:       PropTypes.object.isRequired,
  onAddToCart:       PropTypes.func.isRequired,
};

export default ProductCard;
