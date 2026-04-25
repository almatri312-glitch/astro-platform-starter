import { useState } from 'react';
import { addToCart } from '../../stores/cart';

interface Props {
  id: string;
  slug: string;
  nameAr: string;
  price: number;
  gradient: string;
  large?: boolean;
}

export default function AddToCartButton({ id, slug, nameAr, price, gradient, large }: Props) {
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart({ id, slug, nameAr, price, gradient });
    setAdded(true);
    window.dispatchEvent(new CustomEvent('mocha:open-cart'));
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2
        ${large ? 'py-4 text-base' : 'py-3 text-sm'}
        ${added ? 'scale-95' : 'hover:-translate-y-0.5 hover:shadow-xl'}`}
      style={{
        background: added
          ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
          : 'linear-gradient(135deg, #c8963e 0%, #e8c47a 100%)',
        color: '#0a0500',
        boxShadow: added ? '0 6px 24px rgba(74,222,128,0.35)' : '0 6px 24px rgba(200,150,62,0.35)',
      }}
    >
      {added ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Added to Cart!
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          Add to Cart
        </>
      )}
    </button>
  );
}
