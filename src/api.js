/**
 * LuxeCart API Client
 * Centralized fetch wrapper for all backend communication.
 */
const API_BASE = 'https://ecom-luxecart.onrender.com/api';

/**
 * Get the stored JWT token.
 */
function getToken() {
  return localStorage.getItem('luxecart_token');
}

/**
 * Core fetch wrapper — auto-attaches JWT, handles JSON, throws on errors.
 */
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle non-JSON responses
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    if (!res.ok) {
      throw new ApiError('Server error', res.status);
    }
    return null;
  }

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(data.error || 'Request failed', res.status, data);
  }

  return data;
}

/**
 * Custom error class for API errors.
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// --- Auth API ---

export const authApi = {
  async login(email, password) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      localStorage.setItem('luxecart_token', data.token);
    }
    return data;
  },

  async register(email, password, firstName, lastName) {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
    if (data.token) {
      localStorage.setItem('luxecart_token', data.token);
    }
    return data;
  },

  async me() {
    return apiFetch('/auth/me');
  },

  logout() {
    localStorage.removeItem('luxecart_token');
  },

  hasToken() {
    return !!getToken();
  },
};

// --- Products API ---

export const productsApi = {
  async list(params = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && value !== 'all') {
        if (Array.isArray(value) && value.length > 0) {
          searchParams.set(key, value.join(','));
        } else if (!Array.isArray(value)) {
          searchParams.set(key, value);
        }
      }
    });
    const qs = searchParams.toString();
    return apiFetch(`/products${qs ? `?${qs}` : ''}`);
  },

  async featured() {
    return apiFetch('/products/featured');
  },

  async trending() {
    return apiFetch('/products/trending');
  },

  async getBySlug(slug) {
    return apiFetch(`/products/${slug}`);
  },
};

// --- Orders API ---

export const ordersApi = {
  async create(orderData) {
    return apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async list() {
    return apiFetch('/orders');
  },

  async getByNumber(orderNumber) {
    return apiFetch(`/orders/${orderNumber}`);
  },
};

// --- Cart API ---

export const cartApi = {
  async get() {
    return apiFetch('/cart');
  },

  async add(productId, quantity = 1, selectedColor = '', selectedSize = '') {
    return apiFetch('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, selectedColor, selectedSize }),
    });
  },

  async update(cartItemId, quantity) {
    return apiFetch(`/cart/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  async remove(cartItemId) {
    return apiFetch(`/cart/${cartItemId}`, { method: 'DELETE' });
  },

  async merge(items) {
    return apiFetch('/cart/merge', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  },
};

// --- Wishlist API ---

export const wishlistApi = {
  async get() {
    return apiFetch('/wishlist');
  },

  async add(productId) {
    return apiFetch('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },

  async remove(productId) {
    return apiFetch(`/wishlist/${productId}`, { method: 'DELETE' });
  },
};

// --- Coupons API ---

export const couponsApi = {
  async validate(code, subtotal = 0) {
    return apiFetch('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    });
  },
};

// --- Admin API ---

export const adminApi = {
  async stats() {
    return apiFetch('/admin/stats');
  },

  async orders() {
    return apiFetch('/admin/orders');
  },

  async updateOrderStatus(orderNumber, status) {
    return apiFetch(`/admin/orders/${orderNumber}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async products() {
    return apiFetch('/admin/products');
  },

  async createProduct(product) {
    return apiFetch('/admin/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  async updateProduct(id, product) {
    return apiFetch(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },

  async deleteProduct(id) {
    return apiFetch(`/admin/products/${id}`, { method: 'DELETE' });
  },

  async coupons() {
    return apiFetch('/admin/coupons');
  },
};
