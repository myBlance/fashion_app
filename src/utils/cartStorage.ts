import { CartItem } from '../types/CartItem';

export const getLocalCart = (): CartItem[] => {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

export const saveLocalCart = (cart: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const clearLocalCart = () => {
  localStorage.removeItem("cart");
};
