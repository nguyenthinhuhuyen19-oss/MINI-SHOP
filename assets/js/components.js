/**
 * Mini Shop - Shared Modular Components (Header & Footer)
 * Auto path resolution & dynamic Cart + Wishlist + Auth counter synchronization
 */

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();

  // Listen to state changes to update header instantly
  window.addEventListener('cart-updated', () => {
    updateCartCountBadge();
  });

  window.addEventListener('wishlist-updated', () => {
    updateWishlistCountBadge();
  });

  window.addEventListener('auth-updated', () => {
    renderHeader();
  });
});

function getBasePath() {
  const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
  if (path.includes('/pages/admin/')) {
    return '../../';
  } else if (path.includes('/pages/')) {
    return '../';
  }
  return './';
}

function updateCartCountBadge() {
  const badge = document.getElementById('headerCartCountBadge');
  if (badge && typeof cartManager !== 'undefined') {
    badge.textContent = cartManager.getCartCount();
  }
}

function updateWishlistCountBadge() {
  const badge = document.getElementById('headerWishlistCountBadge');
  if (badge && typeof wishlistManager !== 'undefined') {
    badge.textContent = wishlistManager.getWishlistCount();
  }
}

function renderHeader() {
  const headerPlaceholder = document.getElementById('header-placeholder');
  if (!headerPlaceholder) return;

  const basePath = getBasePath();
  const currentPath = window.location.pathname.replace(/\\/g, '/').toLowerCase();
  const isProducts = currentPath.includes('products.html');
  const isCategories = currentPath.includes('categories.html');
  const isAbout = currentPath.includes('about.html');
  const isContact = currentPath.includes('contact.html');
  const isHome = !isProducts && !isCategories && !isAbout && !isContact;

  const cartCount = (typeof cartManager !== 'undefined') ? cartManager.getCartCount() : 0;
  const wishlistCount = (typeof wishlistManager !== 'undefined') ? wishlistManager.getWishlistCount() : 0;
  const currentUser = (typeof authManager !== 'undefined') ? authManager.getCurrentUser() : null;

  let authAreaHtml = '';

  if (currentUser) {
    authAreaHtml = `
      <div class="btn-auth-group" style="align-items: center; gap: 8px;">
        <span style="font-size: 0.85rem; font-weight: 700; color: var(--primary); background: var(--primary-light); padding: 6px 12px; border-radius: var(--radius-full); border: 1px solid var(--primary-border);">
          👋 ${currentUser.name}
        </span>
        ${currentUser.role === 'admin' ? `
          <button class="btn-admin" onclick="window.location.href='${basePath}pages/admin/dashboard.html'">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Admin
          </button>
        ` : ''}
        <button class="btn-login" style="color: #ef4444; border-color: #fca5a5;" onclick="authManager.logout()">Đăng xuất</button>
      </div>
    `;
  } else {
    authAreaHtml = `
      <div class="btn-auth-group">
        <button class="btn-login" onclick="window.location.href='${basePath}pages/login.html'">Login</button>
        <button class="btn-register" onclick="window.location.href='${basePath}pages/register.html'">Register</button>
        <button class="btn-admin" onclick="window.location.href='${basePath}pages/admin/dashboard.html'">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Admin
        </button>
      </div>
    `;
  }

  headerPlaceholder.innerHTML = `
    <header class="site-header">
      <div class="container header-container">
        <a href="${basePath}index.html" class="brand-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
            <path d="M3 6h18"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          Mini Shop
        </a>

        <nav class="nav-menu" id="navMenu">
          <a href="${basePath}index.html" class="nav-link ${isHome ? 'active' : ''}">Home</a>
          <a href="${basePath}pages/products.html" class="nav-link ${isProducts ? 'active' : ''}">Products</a>
          <a href="${basePath}pages/products.html" class="nav-link ${isCategories ? 'active' : ''}">Categories</a>
          <a href="${basePath}pages/about.html" class="nav-link ${isAbout ? 'active' : ''}">About</a>
          <a href="${basePath}pages/contact.html" class="nav-link ${isContact ? 'active' : ''}">Contact</a>
        </nav>

        <div class="header-actions">
          <div class="search-box">
            <input type="text" class="search-input" id="globalSearchInput" placeholder="Search products...">
            <button class="search-btn" aria-label="Search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </button>
          </div>

          <div class="header-user-widgets" style="display: flex; align-items: center; gap: 14px;">
            <button class="icon-nav-btn" style="background:none; border:none; cursor:pointer; color:var(--dark-muted); display:flex; align-items:center; gap:4px; font-weight:500; font-size:0.88rem;" onclick="window.location.href='${basePath}pages/wishlist.html'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span>Wishlist</span>
              <span id="headerWishlistCountBadge" style="background:#ef4444; color:white; border-radius:50%; width:18px; height:18px; display:inline-flex; align-items:center; justify-content:center; font-size:0.72rem; font-weight:700;">${wishlistCount}</span>
            </button>
            
            <button class="icon-nav-btn" style="background:none; border:none; cursor:pointer; color:var(--dark-muted); display:flex; align-items:center; gap:4px; font-weight:500; font-size:0.88rem;" onclick="window.location.href='${basePath}pages/cart.html'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              <span>Cart</span>
              <span id="headerCartCountBadge" style="background:var(--blue-btn); color:white; border-radius:50%; width:18px; height:18px; display:inline-flex; align-items:center; justify-content:center; font-size:0.72rem; font-weight:700;">${cartCount}</span>
            </button>
          </div>

          ${authAreaHtml}

          <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle navigation">
            &#9776;
          </button>
        </div>
      </div>
    </header>
  `;

  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
    });
  }
}

function renderFooter() {
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (!footerPlaceholder) return;

  const basePath = getBasePath();

  footerPlaceholder.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-about">
            <a href="${basePath}index.html" class="brand-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              Mini Shop
            </a>
            <p class="footer-tagline">Đồ dùng & trang trí cho cuộc sống tiện nghi và phong cách.</p>
            <div class="social-links">
              <a href="#" class="social-icon" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" class="social-icon" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" class="social-icon" aria-label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
              <a href="#" class="social-icon" aria-label="TikTok">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 class="footer-heading">Thông tin</h4>
            <div class="footer-links">
              <a href="#">Về chúng tôi</a>
              <a href="#">Chính sách bảo mật</a>
              <a href="#">Điều khoản sử dụng</a>
              <a href="#">Chính sách đổi trả</a>
            </div>
          </div>

          <div>
            <h4 class="footer-heading">Hỗ trợ khách hàng</h4>
            <div class="footer-links">
              <a href="#">Hướng dẫn mua hàng</a>
              <a href="#">Thanh toán & giao hàng</a>
              <a href="#">Bảo hành & đổi trả</a>
              <a href="#">Câu hỏi thường gặp</a>
            </div>
          </div>

          <div>
            <h4 class="footer-heading">Liên hệ</h4>
            <div class="contact-list">
              <div class="contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>Hà Nội, Việt Nam</span>
              </div>
              <div class="contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>0123 456 789</span>
              </div>
              <div class="contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <span>support@minishop.vn</span>
              </div>
              <div class="contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>08:00 - 21:00 (T2 - CN)</span>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2025 Mini Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;
}
