export const getLocalWishlist = (): string[] => {
    try {
        const wishlist = localStorage.getItem("wishlist");
        return wishlist ? JSON.parse(wishlist) : [];
    } catch {
        return [];
    }
};

export const saveLocalWishlist = (wishlist: string[]) => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
};

export const clearLocalWishlist = () => {
    localStorage.removeItem("wishlist");
};
