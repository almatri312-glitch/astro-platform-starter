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
    return () => {
      unsub();
      window.removeEventListener('mocha:open-cart', openHandler);
    };
  }, []);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setOpen(false)} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-mocha-900 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ borderLeft: '1px solid rgba(200,150,62,0.2)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(200,150,62,0.2)' }}>
          <div>
            <h2 className="text-lg font-black text-cream">Your Cart</h2>
            {count > 0 && <p className="text-xs text-mocha-200 mt-0.5">{count} {count === 1 ? 'item' : 'items'}</p>}
          </div>
          <button onClick={() => setOpen(false)}
            className="p-2 rounded-lg text-mocha-200 hover:text-gold hover:bg-mocha-700 transition-all" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-16">
              <div className="w-20 h-20 rounded-full bg-mocha-800 flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5c2e08" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <div>
                <p className="text-mocha-200 font-semibold text-base">Your cart is empty</p>
                <p className="text-mocha-400 text-sm mt-1">Add your favorite coffees to get started</p>
              </div>
              <button onClick={() => { setOpen(false); window.location.href = '/products'; }}
                className="mt-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all"
                style={{ background: 'linear-gradient(135deg, #c8963e, #e8c47a)', color: '#0a0500' }}>
                Browse Products
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(44,21,3,0.6)', border: '1px solid rgba(200,150,62,0.15)' }}>
                <div className="w-14 h-14 rounded-lg flex-shrink-0" style={{ background: item.gradient }} />
                <div className="flex-1 min-w-0">
                  <p className="text-cream font-bold text-sm leading-tight truncate">{item.nameAr}</p>
                  <p className="text-gold text-sm font-semibold mt-1">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQty(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg bg-mocha-700 text-cream hover:bg-mocha-600 transition flex items-center justify-center font-bold text-base">−</button>
                  <span className="w-6 text-center text-cream font-bold text-sm">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-mocha-700 text-cream hover:bg-mocha-600 transition flex items-center justify-center font-bold text-base">+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)}
                  className="p-1.5 text-mocha-400 hover:text-red-400 transition" aria-label="Remove">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t space-y-4" style={{ borderColor: 'rgba(200,150,62,0.2)' }}>
            <div className="flex justify-between items-center">
              <span className="text-cream font-black text-lg">${total.toFixed(2)}</span>
              <span className="text-mocha-200 text-sm font-medium">Subtotal</span>
            </div>
            <div className="h-px" style={{ background: 'rgba(200,150,62,0.2)' }} />
            <button className="w-full py-3.5 rounded-xl font-black text-base transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #c8963e 0%, #e8c47a 100%)', color: '#0a0500', boxShadow: '0 6px 24px rgba(200,150,62,0.4)' }}>
              Checkout
            </button>
            <button onClick={() => setOpen(false)}
              className="w-full py-2.5 rounded-xl font-semibold text-sm text-mocha-200 hover:text-cream transition">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
