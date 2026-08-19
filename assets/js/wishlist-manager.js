/**
 * Mini Shop - Central Wishlist Manager (localStorage API)
 */
const WISHLIST_STORAGE_KEY = 'mini_shop_wishlist_v1';

const wishlistManager = {
  getWishlist() {
    try {
      const data = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading wishlist from localStorage', e);
      return [];
    }
  },

  saveWishlist(list) {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: list }));
    } catch (e) {
      console.error('Error saving wishlist to localStorage', e);
    }
  },

  isInWishlist(productId) {
    const list = this.getWishlist();
    return list.includes(Number(productId));
  },

  toggleWishlist(productId) {
    const id = Number(productId);
    let list = this.getWishlist();
    let isAdded = false;

    if (list.includes(id)) {
      list = list.filter(item => item !== id);
    } else {
      list.push(id);
      isAdded = true;
    }

    this.saveWishlist(list);
    return isAdded;
  },

  getWishlistCount() {
    return this.getWishlist().length;
  }
};
