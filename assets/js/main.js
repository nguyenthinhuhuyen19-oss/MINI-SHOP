/**
 * Mini Shop - Main Home Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedProducts('all');
  initCategoryFilters();

  window.addEventListener('wishlist-updated', () => {
    renderFeaturedProducts(document.querySelector('.pill-btn.active')?.getAttribute('data-category') || 'all');
  });
});

function showToast(message, isFavorite = true) {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFavorite ? '#ef4444' : 'none'}" stroke="${isFavorite ? '#ef4444' : 'currentColor'}" stroke-width="2.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function handleHomeWishlistToggle(event, productId) {
  event.stopPropagation();
  if (typeof wishlistManager === 'undefined') return;
  const isAdded = wishlistManager.toggleWishlist(productId);
  const p = PRODUCTS_DATA.find(item => item.id === Number(productId));
  const name = p ? p.name : 'sản phẩm';

  if (isAdded) {
    showToast(`Đã thêm ${name} vào danh sách yêu thích`, true);
  } else {
    showToast(`Đã xóa ${name} khỏi danh sách yêu thích`, false);
  }
}

function renderFeaturedProducts(categoryFilter = 'all') {
  const gridContainer = document.getElementById('featured-products-grid');
  if (!gridContainer) return;

  let filtered = PRODUCTS_DATA;
  if (categoryFilter !== 'all') {
    filtered = PRODUCTS_DATA.filter(p => p.category === categoryFilter);
  }

  if (filtered.length === 0) {
    gridContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--gray-muted);">
        Chưa có sản phẩm nào trong danh mục này.
      </div>
    `;
    return;
  }

  gridContainer.innerHTML = filtered.map(product => {
    const isWishlisted = typeof wishlistManager !== 'undefined' && wishlistManager.isInWishlist(product.id);
    const heartSvg = isWishlisted 
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

    return `
      <div class="product-card">
        <div class="product-thumb">
          <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" title="${isWishlisted ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}" onclick="handleHomeWishlistToggle(event, ${product.id})">
            ${heartSvg}
          </button>
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
          <h3 class="product-title" title="${product.name}">${product.name}</h3>
          <div class="product-price">${product.priceFormatted}</div>
          <p class="product-desc">${product.description}</p>
          <button class="btn-card-detail" onclick="window.location.href='pages/product-detail.html?id=${product.id}'">
            Xem chi tiết
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.pill-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      const currentTarget = e.currentTarget;
      currentTarget.classList.add('active');
      const cat = currentTarget.getAttribute('data-category');
      renderFeaturedProducts(cat);
    });
  });
}
