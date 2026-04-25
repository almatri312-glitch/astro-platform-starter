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
      className="w-full transition-all duration-300 flex items-center justify-center gap-2"
      style={{
        padding: large ? '1rem 2rem' : '0.75rem 1.5rem',
        fontSize: '0.6rem',
        fontWeight: 600,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        background: added ? '#2C5F2E' : '#1A0F00',
        color: '#FAF7F2',
        border: 'none',
        cursor: 'pointer',
        transition: 'background 0.3s ease',
      }}
    >
      {added ? '✓  Added to Cart' : 'Add to Cart'}
    </button>
  );
}
