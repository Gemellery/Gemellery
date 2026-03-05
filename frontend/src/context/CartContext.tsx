import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { CartItem } from '@/lib/cart/types';
import * as cartApi from '@/lib/cart/api';

// ============================================================
// Context Type — what every component gets access to
// ============================================================

interface CartContextType {
  // State
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  addToCart: (gemId: number) => Promise<boolean>;
  removeFromCart: (cartItemId: number) => Promise<boolean>;
  updateCartItem: (cartItemId: number, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

// ============================================================
// Create Context + Hook
// ============================================================

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart() must be used inside <CartProvider>');
  }
  return context;
}

// ============================================================
// Provider Component
// ============================================================

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Load cart from backend
  const refreshCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    // Only fetch cart if logged in as a buyer
    let role = '';
    try {
      role = user ? JSON.parse(user).role?.toLowerCase() : '';
    } catch { }

    if (!token || role !== 'buyer') {
      setItems([]);
      setTotalAmount(0);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cart = await cartApi.getCart();

      // Parse prices as numbers to prevent string concatenation
      const parsedItems = cart.items.map(item => ({
        ...item,
        price: Number(item.price) || 0,
        total_price: Number(item.total_price) || 0,
        quantity: Number(item.quantity) || 1,
        carat: item.carat ? Number(item.carat) : undefined,
      }));

      setItems(parsedItems);

      // Calculate total by adding numbers, not strings
      const calculatedTotal = parsedItems.reduce(
        (sum, item) => sum + (item.total_price || item.price * item.quantity),
        0
      );

      setTotalAmount(calculatedTotal);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load cart:', err);
      if (err.message?.includes('Not authenticated')) {
        setItems([]);
        setTotalAmount(0);
      } else {
        setError(err.message || 'Failed to load cart');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add gem to cart
  const addToCart = useCallback(async (gemId: number): Promise<boolean> => {
    setError(null);
    try {
      await cartApi.addToCart(gemId, 1);
      await refreshCart();
      return true;
    } catch (err: any) {
      console.error('Failed to add to cart:', err);
      setError(err.message || 'Failed to add item to cart');
      return false;
    }
  }, [refreshCart]);

  // Remove item from cart
  const removeFromCart = useCallback(async (cartItemId: number): Promise<boolean> => {
    setError(null);
    try {
      await cartApi.removeFromCart(cartItemId);
      setItems((prev) => prev.filter((item) => item.cart_item_id !== cartItemId));
      await refreshCart();
      return true;
    } catch (err: any) {
      console.error('Failed to remove from cart:', err);
      setError(err.message || 'Failed to remove item');
      await refreshCart();
      return false;
    }
  }, [refreshCart]);

  // Update item quantity
  const updateCartItem = useCallback(async (cartItemId: number, quantity: number): Promise<boolean> => {
    setError(null);
    try {
      if (quantity < 1) {
        throw new Error('Quantity must be at least 1');
      }
      await cartApi.updateCartItem(cartItemId, quantity);
      setItems((prev) =>
        prev.map((item) =>
          item.cart_item_id === cartItemId
            ? { ...item, quantity, total_price: item.price * quantity }
            : item
        )
      );
      await refreshCart();
      return true;
    } catch (err: any) {
      console.error('Failed to update cart item:', err);
      setError(err.message || 'Failed to update item quantity');
      await refreshCart();
      return false;
    }
  }, [refreshCart]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    setError(null);
    try {
      await cartApi.clearCart();
      setItems([]);
      setTotalAmount(0);
    } catch (err: any) {
      console.error('Failed to clear cart:', err);
      setError(err.message || 'Failed to clear cart');
      await refreshCart();
    }
  }, [refreshCart]);

  // Load cart on mount
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Refresh on login/logout (other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        refreshCart();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshCart]);

  const value: CartContextType = {
    items,
    totalAmount,
    itemCount,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}