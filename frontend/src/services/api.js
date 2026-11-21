const API_BASE = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('shopnova_token');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Prefer express-validator's structured error list if present, else the plain message.
    const message =
      (data.errors && data.errors.length > 0 && data.errors[0].message) ||
      data.message ||
      'Request failed';
    throw new Error(message);
  }
  return data;
}

function buildQuery(params = {}) {
  const usable = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  if (usable.length === 0) return '';
  return '?' + new URLSearchParams(usable).toString();
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  // Products (public)
  getProducts: (filters) => request(`/products${buildQuery(filters)}`),
  getProduct: (id) => request(`/products/${id}`),
  getCategories: () => request('/products/categories'),

  // Products (admin)
  createProduct: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // Cart
  getCart: () => request('/cart'),
  addToCart: (product_id, quantity = 1) =>
    request('/cart', { method: 'POST', body: JSON.stringify({ product_id, quantity }) }),
  removeFromCart: (id) => request(`/cart/${id}`, { method: 'DELETE' }),
  checkout: (shippingDetails) =>
    request('/cart/checkout', { method: 'POST', body: JSON.stringify(shippingDetails) }),

  // Orders (customer)
  getMyOrders: () => request('/orders/my'),
  getMyOrder: (id) => request(`/orders/${id}`),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAdminCustomers: () => request('/admin/customers'),
  getAdminOrders: () => request('/admin/orders'),
  updateOrderStatus: (id, status) =>
    request(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) })
};
