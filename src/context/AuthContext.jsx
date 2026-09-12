import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, ordersApi } from '../api';

const AuthContext = createContext();

/**
 * Load saved user from localStorage (for initial render before token validation).
 */
function loadUser() {
  try {
    const saved = localStorage.getItem('luxecart_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Persist user to localStorage for fast initial render
  useEffect(() => {
    if (user) {
      localStorage.setItem('luxecart_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('luxecart_user');
    }
  }, [user]);

  // Validate token on mount
  useEffect(() => {
    async function validateSession() {
      if (!authApi.hasToken()) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const data = await authApi.me();
        setUser(data.user);
      } catch {
        // Token invalid/expired — clear session
        authApi.logout();
        setUser(null);
        localStorage.removeItem('luxecart_user');
      } finally {
        setLoading(false);
      }
    }
    validateSession();
  }, []);

  // Fetch orders when user is logged in
  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }
    try {
      const data = await ordersApi.list();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setOrders([]);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const login = async (email, password) => {
    try {
      const data = await authApi.login(email, password);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const [firstName, ...rest] = name.trim().split(' ');
      const lastName = rest.join(' ');
      const data = await authApi.register(email, password, firstName, lastName);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setOrders([]);
    localStorage.removeItem('luxecart_user');
    localStorage.removeItem('luxecart_cart');
    localStorage.removeItem('luxecart_coupon');
  };

  const addOrder = async (orderData) => {
    try {
      const data = await ordersApi.create(orderData);
      // Refresh orders list
      await fetchOrders();
      return data.order;
    } catch (err) {
      console.error('Failed to create order:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      isAdmin: user?.role === 'admin',
      orders,
      loading,
      login,
      register,
      logout,
      addOrder,
      refreshOrders: fetchOrders,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
