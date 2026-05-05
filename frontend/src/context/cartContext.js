import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

const cartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      return existing
        ? prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (!existing) return prev;
      if (existing.quantity === 1) return prev.filter(i => i.id !== item.id);
      return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i);
    });
  }, []);

  const clearItemFromCart = useCallback((item) => {
    setCartItems(prev => prev.filter(i => i.id !== item.id));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const cartCount = useMemo(() =>
    cartItems.reduce((acc, item) => acc + item.quantity, 0)
    , [cartItems]);

  const cartTotal = useMemo(() =>
    cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    , [cartItems]);

  const cartTotalTime = useMemo(() =>
    cartItems.reduce((acc, item) => acc + (item.prepareTime * item.quantity), 0)
    , [cartItems]);

  const value = useMemo(() => ({
    cartItems, addToCart, removeFromCart, clearCart, clearItemFromCart, cartTotal, cartCount, cartTotalTime
  }), [cartItems, addToCart, removeFromCart, clearCart, clearItemFromCart, cartTotal, cartCount, cartTotalTime]);


  return (
    <cartContext.Provider value={value}>
      {children}
    </cartContext.Provider>
  );
};


export const useCart = () => {
  return useContext(cartContext);
};
