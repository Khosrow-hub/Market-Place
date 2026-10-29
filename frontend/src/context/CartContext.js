import { createContext, useEffect, useMemo, useState } from 'react';

export const CartContext = createContext(null);
const CART_STORAGE_KEY = 'dari-marketplace-cart';

const loadCart = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    const id = product.id || product._id;
    setItems(current => {
      const existing = current.find(item => item.id === id);
      const nextQuantity = Math.min((existing?.quantity || 0) + quantity, product.stock || Infinity);
      if (existing) {
        return current.map(item => item.id === id ? { ...item, quantity: nextQuantity, stock: product.stock } : item);
      }
      return [...current, {
        id,
        name: product.name,
        price: product.price,
        currency: product.currency || 'USD',
        image: product.images?.[0],
        stock: product.stock,
        source: product.source,
        quantity: Math.min(quantity, product.stock || quantity)
      }];
    });
  };

  const updateQuantity = (id, quantity) => {
    setItems(current => current.map(item => item.id === id ? {
      ...item,
      quantity: Math.max(1, Math.min(Number(quantity) || 1, item.stock || Infinity))
    } : item));
  };

  const removeItem = id => setItems(current => current.filter(item => item.id !== id));
  const clearCart = () => setItems([]);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(() => ({ items, addItem, updateQuantity, removeItem, clearCart, subtotal }), [items, subtotal]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
