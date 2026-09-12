import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { wishlistApi } from '../api';

const WishlistContext = createContext();

function loadLocalWishlist() {
  try {
    const saved = localStorage.getItem('luxecart_wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState(loadLocalWishlist);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('luxecart_wishlist', JSON.stringify(items));
  }, [items]);

  // Sync with server when logged in
  useEffect(() => {
    if (!isLoggedIn) return;

    async function fetchServerWishlist() {
      try {
        const data = await wishlistApi.get();
        setItems(data.items || []);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
      }
    }
    fetchServerWishlist();
  }, [isLoggedIn]);

  const addItem = useCallback(async (productId) => {
    setItems(prev => prev.includes(productId) ? prev : [...prev, productId]);
    if (isLoggedIn) {
      try {
        const data = await wishlistApi.add(productId);
        setItems(data.items);
      } catch (err) {
        console.error('Failed to add to wishlist:', err);
      }
    }
  }, [isLoggedIn]);

  const removeItem = useCallback(async (productId) => {
    setItems(prev => prev.filter(id => id !== productId));
    if (isLoggedIn) {
      try {
        const data = await wishlistApi.remove(productId);
        setItems(data.items);
      } catch (err) {
        console.error('Failed to remove from wishlist:', err);
      }
    }
  }, [isLoggedIn]);

  const toggleItem = useCallback(async (productId) => {
    const isCurrentlyWishlisted = items.includes(productId);
    if (isCurrentlyWishlisted) {
      await removeItem(productId);
    } else {
      await addItem(productId);
    }
  }, [items, addItem, removeItem]);

  const isWishlisted = useCallback((productId) => items.includes(productId), [items]);

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, toggleItem, isWishlisted, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
