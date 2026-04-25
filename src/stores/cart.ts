export interface CartItem {
  id: string;
  slug: string;
  nameAr: string;
  price: number;
  gradient: string;
  quantity: number;
}

const KEY = 'mocha-cart';
const EVENT = 'mocha:cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function emit(cart: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent(EVENT, { detail: cart }));
}

export function addToCart(item: Omit<CartItem, 'quantity'>, qty = 1) {
  const cart = getCart();
  const idx = cart.findIndex((i) => i.id === item.id);
  if (idx > -1) {
    cart[idx].quantity += qty;
  } else {
    cart.push({ ...item, quantity: qty });
  }
  emit(cart);
}

export function removeFromCart(id: string) {
  emit(getCart().filter((i) => i.id !== id));
}

export function updateQty(id: string, quantity: number) {
  if (quantity < 1) return removeFromCart(id);
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (item) item.quantity = quantity;
  emit(cart);
}

export function clearCart() {
  emit([]);
}

export function getCartCount(): number {
  return getCart().reduce((s, i) => s + i.quantity, 0);
}

export function getCartTotal(): number {
  return getCart().reduce((s, i) => s + i.price * i.quantity, 0);
}

export function onCartChange(cb: (items: CartItem[]) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<CartItem[]>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
