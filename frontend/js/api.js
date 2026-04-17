import { APP_CONFIG } from './config.js';
import { getAuth } from './store.js';

async function request(path, options = {}) {
  const auth = getAuth();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (auth?.token) {
    headers.Authorization = `Bearer ${auth.token}`;
  }

  const response = await fetch(`${APP_CONFIG.API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let payload = {};
    try {
      payload = await response.json();
    } catch {
      payload = {};
    }
    throw new Error(payload.message || 'Ocurrió un error en la API.');
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  getCategories() {
    return request('/products/categories');
  },
  getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },
  getProduct(slug) {
    return request(`/products/${slug}`);
  },
  createReview(productId, payload) {
    return request(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  register(payload) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  login(payload) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  me() {
    return request('/auth/me');
  },
  updateProfile(payload) {
    return request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  forgotPassword(payload) {
    return request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  resetPassword(payload) {
    return request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getMyOrders() {
    return request('/orders/mine');
  },
  createCheckoutSession(payload) {
    return request('/checkout/create-session', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  adminDashboard() {
    return request('/admin/dashboard');
  },
  adminOrders() {
    return request('/admin/orders');
  },
  adminUpdateOrderStatus(id, status) {
    return request(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
  adminProducts() {
    return request('/admin/products');
  },
  adminCreateProduct(payload) {
    return request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  adminUpdateProduct(id, payload) {
    return request(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  adminDeleteProduct(id) {
    return request(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  },
  adminUsers() {
    return request('/admin/users');
  },
  adminUpdateUserRole(id, role) {
    return request(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },
};
