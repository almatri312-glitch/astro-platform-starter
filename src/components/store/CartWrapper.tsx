import { useState, useEffect } from 'react';
import { getCart, removeFromCart, updateQty, onCartChange, type CartItem } from '../../stores/cart';

export default function CartWrapper() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCart());
    const unsub = onCartChange((cart) => setItems(cart));
    const openHandler = () => setOpen(true);
    window.addEventListener('mocha:open-cart', openHandler);
    return () => { unsub(); window.removeEventListener('mocha:open-cart', openHandler); };
  }, []);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      {open && <div className="fixed inset-0 z-40" style={{ background: 'rgba(26,15,0,0.3)', backdropFilter: 'blur(2px)' }} onClick={() => setOpen(false)} />}

      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 z-50 flex flex-col transition-transform duration-400 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ background: '#FAF7F2', borderLeft: '1px solid rgba(26,15,0,0.08)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b" style={{ borderColor: 'rgba(26,15,0,0.08)' }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: '1.5rem', fontWeight: 300, color: '#1A0F00' }}>
              Your Cart
            </h2>
            {count > 0 && <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: '#9B7A50', marginTop: '2px', textTransform: 'uppercase' }}>{count} {count === 1 ? 'item' : 'items'}</p>}
          </div>
          <button onClick={() => setOpen(false)} style={{ color: '#1A0F00', opacity: 0.4 }} className="hover:opacity-100 transition-opacity" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-16">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9B7A50" strokeWidth="1" strokeLinecap="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <div>
                <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: '1.3rem', fontWeight: 300, color: '#1A0F00' }}>Your cart is empty</p>
                <p style={{ fontSize: '0.8rem', color: '#9B7A50', marginTop: '6px', fontWeight: 300 }}>Add your favourite coffees to begin</p>
              </div>
              <button onClick={() => { setOpen(false); window.location.href = '/products'; }}
                style={{ padding: '0.75rem 2rem', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', background: '#1A0F00', color: '#FAF7F2', border: 'none', cursor: 'pointer' }}>
                Browse Coffees
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 pb-5" style={{ borderBottom: '1px solid rgba(26,15,0,0.06)' }}>
                <div className="w-16 h-16 flex-shrink-0" style={{ background: item.gradient }} />
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: '0.85rem', fontWeight: 500, color: '#1A0F00' }}>{item.nameAr}</p>
                  <p style={{ fontSize: '0.8rem', color: '#9B7A50', marginTop: '2px' }}>${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ width: '24px', height: '24px', border: '1px solid rgba(26,15,0,0.15)', background: 'transparent', color: '#1A0F00', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <span style={{ fontSize: '0.85rem', color: '#1A0F00', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ width: '24px', height: '24px', border: '1px solid rgba(26,15,0,0.15)', background: 'transparent', color: '#1A0F00', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{ color: '#9B7A50', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }} className="hover:opacity-50 transition-opacity">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-8 py-6 border-t space-y-5" style={{ borderColor: 'rgba(26,15,0,0.08)' }}>
            <div className="flex justify-between items-center">
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9B7A50' }}>Subtotal</span>
              <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: '1.5rem', fontWeight: 300, color: '#1A0F00' }}>${total.toFixed(2)}</span>
            </div>
            <button className="w-full transition-opacity hover:opacity-80"
              style={{ padding: '1rem', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', background: '#1A0F00', color: '#FAF7F2', border: 'none', cursor: 'pointer' }}>
              Proceed to Checkout
            </button>
            <button onClick={() => setOpen(false)} className="w-full transition-opacity hover:opacity-60"
              style={{ padding: '0.6rem', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'transparent', color: '#9B7A50', border: 'none', cursor: 'pointer' }}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
