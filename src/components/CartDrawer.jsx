import React from 'react';
import PropTypes from 'prop-types';
import { ShoppingCart, X, CheckCircle, Trash2, Plus, Minus } from 'lucide-react';

/**
 * CartDrawer — slide-out cart panel rendered as an accessible dialog.
 */
export default function CartDrawer({ cart, onClose, onUpdateQuantity, onRemove, onCheckout, checkoutSuccess }) {
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', justifyContent: 'flex-end' }}
    >
      <div style={{ width: '450px', background: 'var(--surface-solid)', height: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 25px rgba(0,0,0,0.5)' }}>
        <div className="flex-between" style={{ marginBottom: '2rem' }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShoppingCart size={24} aria-hidden="true" /> Your Cart
          </h2>
          <button
            className="btn btn-outline"
            style={{ padding: '0.5rem', borderRadius: '50%' }}
            onClick={onClose}
            aria-label="Close cart"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {checkoutSuccess ? (
          <div role="status" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--success)', textAlign: 'center' }}>
            <CheckCircle size={64} style={{ marginBottom: '1rem' }} aria-hidden="true" />
            <h3 style={{ color: 'var(--success)' }}>Order Placed Successfully!</h3>
            <p className="text-muted">Simulated items have been routed to fulfillment.</p>
          </div>
        ) : cart.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)' }}>
            <ShoppingCart size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} aria-hidden="true" />
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <>
            <ul role="list" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none', padding: 0, margin: 0 }}>
              {cart.map((item) => (
                <li key={item.id} style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                  <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{item.product.name}</h4>
                    <button
                      style={{ padding: '0.2rem', color: 'var(--danger)', border: 'none', background: 'transparent', cursor: 'pointer' }}
                      onClick={() => onRemove(item.id)}
                      aria-label={`Remove ${item.product.name} from cart`}
                    >
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Sourced from: <strong>{item.store.name}</strong>
                  </div>
                  <div className="flex-between" style={{ background: 'var(--surface)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                    <div className="flex-gap" style={{ gap: '0.5rem' }} role="group" aria-label={`Quantity for ${item.product.name}`}>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '0.3rem', borderRadius: '0.25rem' }}
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.product.name}`}
                      >
                        <Minus size={14} aria-hidden="true" />
                      </button>
                      <span aria-live="polite" style={{ fontWeight: 600, width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '0.3rem', borderRadius: '0.25rem' }}
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.product.name}`}
                      >
                        <Plus size={14} aria-hidden="true" />
                      </button>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{item.product.price * item.quantity}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
              <div className="flex-between" style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
                <span>Total:</span>
                <span style={{ color: 'var(--success)' }}>₹{cartTotal}</span>
              </div>
              <button className="btn" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} onClick={onCheckout}>
                Checkout Now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

CartDrawer.propTypes = {
  cart:            PropTypes.arrayOf(PropTypes.shape({
    id:       PropTypes.string.isRequired,
    product:  PropTypes.object.isRequired,
    store:    PropTypes.object.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
  onClose:         PropTypes.func.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemove:         PropTypes.func.isRequired,
  onCheckout:       PropTypes.func.isRequired,
  checkoutSuccess:  PropTypes.bool.isRequired,
};
