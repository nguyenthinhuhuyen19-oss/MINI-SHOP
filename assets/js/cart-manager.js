/**
 * Mini Shop - Central Shopping Cart Manager (localStorage API)
 */
const CART_STORAGE_KEY = 'mini_shop_cart_v1';

const cartManager = {
  getCart() {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading cart from localStorage', e);
      return [];
    }
  },

  saveCart(cart) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  },

  addToCart(productId, quantity = 1) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.id === Number(productId));

    if (existingIndex > -1) {
      cart[existingIndex].quantity += Number(quantity);
    } else {
      const product = PRODUCTS_DATA.find(p => p.id === Number(productId));
      if (product) {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          priceFormatted: product.priceFormatted,
          image: product.image,
          quantity: Number(quantity)
        });
      }
    }

    this.saveCart(cart);
  },

  updateQuantity(productId, quantity) {
    let cart = this.getCart();
    const target = cart.find(item => item.id === Number(productId));
    if (target) {
      target.quantity = Math.max(1, Number(quantity));
      this.saveCart(cart);
    }
  },

  removeFromCart(productId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.id !== Number(productId));
    this.saveCart(cart);
  },

  clearCart() {
    this.saveCart([]);
  },

  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  getCartSubtotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
};
