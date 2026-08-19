/**
 * Mini Shop - Wishlist Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
  renderWishlistGrid();

  window.addEventListener('wishlist-updated', () => {
    renderWishlistGrid();
  });
});

function getAssetPrefix() {
  const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
  if (path.includes('/pages/admin/')) return '../../';
  if (path.includes('/pages/')) return '../';
  return './';
}

function showToast(message) {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function renderWishlistGrid() {
  const container = document.getElementById('wishlistPageContainer');
  if (!container) return;

  const wishlistIds = wishlistManager.getWishlist();
  const wishlistedProducts = PRODUCTS_DATA.filter(p => wishlistIds.includes(p.id));

  if (wishlistedProducts.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-card card-animate">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--gray-light)" stroke-width="1.5" style="margin-bottom: 16px;">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <h2 style="font-size: 1.4rem; color: var(--dark); margin-bottom: 8px;">Danh sách yêu thích đang trống</h2>
        <p style="font-size: 0.9rem; color: var(--gray-muted); margin-bottom: 24px;">Hãy thả tim các sản phẩm bạn yêu thích để xem lại bất cứ lúc nào!</p>
        <a href="products.html" class="btn-hero" style="text-decoration: none;">Khám phá sản phẩm</a>
      </div>
    `;
    return;
  }

  const prefix = getAssetPrefix();

  container.innerHTML = `
    <div class="products-page-grid card-animate" style="grid-template-columns: repeat(4, 1fr);">
      ${wishlistedProducts.map(product => `
        <div class="product-card">
          <div class="product-thumb">
            <button class="wishlist-btn active" title="Bỏ khỏi yêu thích" onclick="handleRemoveWishlist(${product.id})">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            <img src="${prefix}${product.image}" alt="${product.name}" loading="lazy">
          </div>
          <div class="product-info">
            <h3 class="product-title" title="${product.name}">${product.name}</h3>
            <div class="product-price-row">
              <span class="product-price">${product.priceFormatted}</span>
            </div>
            <span class="stock-status-tag">Còn hàng</span>
            <button class="btn-card-detail" onclick="window.location.href='product-detail.html?id=${product.id}'">
              Xem chi tiết
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function handleRemoveWishlist(productId) {
  const p = PRODUCTS_DATA.find(item => item.id === Number(productId));
  wishlistManager.toggleWishlist(productId);
  if (p) showToast(`Đã xóa ${p.name} khỏi danh sách yêu thích`);
}
