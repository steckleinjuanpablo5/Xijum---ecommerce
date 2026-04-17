const CART_KEY = 'xijum_cart';
const AUTH_KEY = 'xijum_auth';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getCart() {
  return read(CART_KEY, []);
}

export function saveCart(items) {
  write(CART_KEY, items);
  window.dispatchEvent(new CustomEvent('cart:updated'));
}

export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(item => Number(item.productId) === Number(product.id));
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      productId: Number(product.id),
      name: product.name,
      price: Number(product.price),
      imageName: product.image_name,
      slug: product.slug,
      quantity,
    });
  }
  saveCart(cart);
}

export function updateCartItem(productId, quantity) {
  const cart = getCart().map(item =>
    Number(item.productId) === Number(productId) ? { ...item, quantity: Math.max(1, Number(quantity)) } : item
  );
  saveCart(cart);
}

export function removeCartItem(productId) {
  const cart = getCart().filter(item => Number(item.productId) !== Number(productId));
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export function getAuth() {
  return read(AUTH_KEY, { token: null, user: null });
}

export function saveAuth(auth) {
  write(AUTH_KEY, auth);
  window.dispatchEvent(new CustomEvent('auth:updated'));
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new CustomEvent('auth:updated'));
}

export function isAdmin() {
  return getAuth()?.user?.role === 'admin';
}
