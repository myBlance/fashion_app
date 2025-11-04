export const getLocalCart = () => {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

export const saveLocalCart = (cart: any[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const clearLocalCart = () => {
  localStorage.removeItem("cart");
};
