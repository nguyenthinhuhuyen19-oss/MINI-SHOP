/**
 * Mini Shop - Central Authentication Manager (localStorage API)
 */
const AUTH_STORAGE_KEY = 'mini_shop_auth_v1';

const authManager = {
  getCurrentUser() {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading auth state from localStorage', e);
      return null;
    }
  },

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user !== null && user.role === 'admin';
  },

  login(email, password) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPass = String(password || '').trim();

    let role = 'user';
    let name = cleanEmail.split('@')[0] || 'Khách hàng';

    if (cleanEmail.includes('admin') || cleanPass === 'admin123') {
      role = 'admin';
      name = 'Quản trị viên (Admin)';
    }

    const userObj = {
      email: cleanEmail,
      name: name,
      role: role,
      loginAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userObj));
      window.dispatchEvent(new CustomEvent('auth-updated', { detail: userObj }));
    } catch (e) {
      console.error('Error saving auth state to localStorage', e);
    }

    return userObj;
  },

  register(name, email, password) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanName = String(name || '').trim() || 'Khách hàng';

    const userObj = {
      email: cleanEmail,
      name: cleanName,
      role: 'user',
      registeredAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userObj));
      window.dispatchEvent(new CustomEvent('auth-updated', { detail: userObj }));
    } catch (e) {
      console.error('Error saving auth state to localStorage', e);
    }

    return userObj;
  },

  logout() {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('auth-updated', { detail: null }));
    } catch (e) {
      console.error('Error removing auth state from localStorage', e);
    }
  }
};
