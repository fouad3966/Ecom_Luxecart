import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { cartApi, couponsApi } from '../api';

const CartContext = createContext();

const SHIPPING_COST = 9.99;
const FREE_SHIPPING_THRESHOLD = 100;

function loadLocalCart() {
  try {
    const saved = localStorage.getItem('luxecart_cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function loadCoupon() {
  try {
    const saved = localStorage.getItem('luxecart_coupon');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_ITEMS': {
      return { ...state, items: action.payload, syncing: false };
    }

    case 'ADD_ITEM': {
      const { product, quantity = 1, selectedColor, selectedSize } = action.payload;
      const itemKey = `${product.id}-${selectedColor || ''}-${selectedSize || ''}`;

      const existingIndex = state.items.findIndex(item => item.itemKey === itemKey);

      let newItems;
      if (existingIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: Math.min(item.quantity + quantity, 10) }
            : item
        );
      } else {
        newItems = [...state.items, {
          itemKey,
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images?.[0] || '',
          selectedColor,
          selectedSize,
          quantity,
          slug: product.slug,
        }];
      }

      return { ...state, items: newItems };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.itemKey !== action.payload),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { itemKey, quantity } = action.payload;
      if (quantity < 1) {
        return {
          ...state,
          items: state.items.filter(item => item.itemKey !== itemKey),
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.itemKey === itemKey ? { ...item, quantity: Math.min(quantity, 10) } : item
        ),
      };
    }

    case 'APPLY_COUPON': {
      return { ...state, appliedCoupon: action.payload, couponError: null };
    }

    case 'COUPON_ERROR': {
      return { ...state, couponError: action.payload };
    }

    case 'REMOVE_COUPON': {
      return { ...state, appliedCoupon: null, couponError: null };
    }

    case 'CLEAR_COUPON_ERROR': {
      return { ...state, couponError: null };
    }

    case 'CLEAR_CART': {
      return { ...state, items: [], appliedCoupon: null, couponError: null };
    }

    case 'SET_SYNCING': {
      return { ...state, syncing: action.payload };
    }

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const { isLoggedIn, user } = useAuth();

  const [state, dispatch] = useReducer(cartReducer, {
    items: loadLocalCart(),
    appliedCoupon: loadCoupon(),
    couponError: null,
    syncing: false,
  });

  // Persist cart to localStorage (fallback for guests, fast hydration for logged-in)
  useEffect(() => {
    localStorage.setItem('luxecart_cart', JSON.stringify(state.items));
  }, [state.items]);

  useEffect(() => {
    if (state.appliedCoupon) {
      localStorage.setItem('luxecart_coupon', JSON.stringify(state.appliedCoupon));
    } else {
      localStorage.removeItem('luxecart_coupon');
    }
  }, [state.appliedCoupon]);

  // Sync cart with server when user logs in
  const syncCartWithServer = useCallback(async () => {
    if (!isLoggedIn) return;

    dispatch({ type: 'SET_SYNCING', payload: true });
    try {
      // If there are local cart items, merge them to server first
      const localItems = loadLocalCart();
      if (localItems.length > 0) {
        const mergePayload = localItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedColor: item.selectedColor || '',
          selectedSize: item.selectedSize || '',
        }));
        const data = await cartApi.merge(mergePayload);
        dispatch({ type: 'SET_ITEMS', payload: data.items });
      } else {
        // Just fetch server cart
        const data = await cartApi.get();
        dispatch({ type: 'SET_ITEMS', payload: data.items });
      }
    } catch (err) {
      console.error('Failed to sync cart:', err);
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    syncCartWithServer();
  }, [syncCartWithServer]);

  // --- Actions ---

  const addItem = useCallback(async (product, quantity = 1, selectedColor, selectedSize) => {
    // Optimistic local update
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, selectedColor, selectedSize } });

    // Sync with server if logged in
    if (isLoggedIn) {
      try {
        const data = await cartApi.add(product.id, quantity, selectedColor || '', selectedSize || '');
        dispatch({ type: 'SET_ITEMS', payload: data.items });
      } catch (err) {
        console.error('Failed to add to cart on server:', err);
      }
    }
  }, [isLoggedIn]);

  const removeItem = useCallback(async (itemKey) => {
    const item = state.items.find(i => i.itemKey === itemKey);
    dispatch({ type: 'REMOVE_ITEM', payload: itemKey });

    if (isLoggedIn && item?.id) {
      try {
        await cartApi.remove(item.id);
      } catch (err) {
        console.error('Failed to remove cart item on server:', err);
      }
    }
  }, [isLoggedIn, state.items]);

  const updateQuantity = useCallback(async (itemKey, quantity) => {
    const item = state.items.find(i => i.itemKey === itemKey);
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemKey, quantity } });

    if (isLoggedIn && item?.id) {
      try {
        if (quantity < 1) {
          await cartApi.remove(item.id);
        } else {
          await cartApi.update(item.id, quantity);
        }
      } catch (err) {
        console.error('Failed to update cart on server:', err);
      }
    }
  }, [isLoggedIn, state.items]);

  const applyCoupon = useCallback(async (code) => {
    try {
      const currentSubtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const data = await couponsApi.validate(code, currentSubtotal);
      dispatch({ type: 'APPLY_COUPON', payload: { code: data.coupon.code, ...data.coupon } });
    } catch (err) {
      dispatch({ type: 'COUPON_ERROR', payload: err.message || 'Invalid coupon code' });
    }
  }, [state.items]);

  const removeCoupon = useCallback(() => {
    dispatch({ type: 'REMOVE_COUPON' });
  }, []);

  const clearCouponError = useCallback(() => {
    dispatch({ type: 'CLEAR_COUPON_ERROR' });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  // Computed values
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;
  if (state.appliedCoupon) {
    if (state.appliedCoupon.type === 'percentage') {
      discount = subtotal * (state.appliedCoupon.value / 100);
    } else if (state.appliedCoupon.type === 'fixed') {
      discount = subtotal >= 200 ? state.appliedCoupon.value : 0;
    }
  }

  const isFreeShipping = state.appliedCoupon?.type === 'freeShipping' || subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = state.items.length === 0 ? 0 : (isFreeShipping ? 0 : SHIPPING_COST);
  const total = Math.max(0, subtotal - discount + shipping);

  const value = {
    items: state.items,
    itemCount,
    subtotal,
    discount,
    shipping,
    total,
    isFreeShipping,
    appliedCoupon: state.appliedCoupon,
    couponError: state.couponError,
    syncing: state.syncing,
    addItem,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCouponError,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
