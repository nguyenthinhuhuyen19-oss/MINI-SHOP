/**
 * Mini Shop - Product List Page Interactive Script
 * Real-time filter, instant search, and wishlist toggle integration
 */

let currentCategory = 'all';
let currentPriceRange = 'all';
let inStockOnly = true;
let searchQuery = '';
let currentSort = 'newest';

document.addEventListener('DOMContentLoaded', () => {
  initCategoryCounts();
  initFilterEvents();
  initSearchAndSort();
  renderProductsGrid();

  window.addEventListener('wishlist-updated', () => {
    renderProductsGrid();
  });
});

function getAssetPrefix() {
  const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
  if (path.includes('/pages/admin/')) return '../../';
  if (path.includes('/pages/')) return '../';
  return './';
}

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

function handleWishlistToggle(event, productId) {
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

function initCategoryCounts() {
  const counts = {
    'all': PRODUCTS_DATA.length,
    'noi-that': PRODUCTS_DATA.filter(p => p.category === 'noi-that').length,
    'trang-tri': PRODUCTS_DATA.filter(p => p.category === 'trang-tri').length,
    'nha-bep': PRODUCTS_DATA.filter(p => p.category === 'nha-bep').length,
    'den': PRODUCTS_DATA.filter(p => p.category === 'den').length,
    'luu-tru': PRODUCTS_DATA.filter(p => p.category === 'luu-tru').length,
    'van-phong': PRODUCTS_DATA.filter(p => p.category === 'van-phong').length
  };

  for (const [cat, count] of Object.entries(counts)) {
    const el = document.getElementById(`cat-count-${cat}`);
    if (el) el.textContent = count;
  }
}

function initFilterEvents() {
  const catItems = document.querySelectorAll('.filter-cat-item');
  catItems.forEach(item => {
    item.addEventListener('click', (e) => {
      catItems.forEach(c => c.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      currentCategory = target.getAttribute('data-category');
      renderProductsGrid();
    });
  });

  const priceRadios = document.querySelectorAll('input[name="priceRange"]');
  priceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentPriceRange = e.target.value;
      renderProductsGrid();
    });
  });

  const stockCheckbox = document.getElementById('stockOnlyCheckbox');
  if (stockCheckbox) {
    stockCheckbox.addEventListener('change', (e) => {
      inStockOnly = e.target.checked;
      renderProductsGrid();
    });
  }
}

function initSearchAndSort() {
  const toolbarSearchInput = document.getElementById('toolbarSearchInput');
  const globalSearchInput = document.getElementById('globalSearchInput');

  if (toolbarSearchInput) {
    toolbarSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      if (globalSearchInput) globalSearchInput.value = e.target.value;
      renderProductsGrid();
    });
  }

  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      if (toolbarSearchInput) toolbarSearchInput.value = e.target.value;
      renderProductsGrid();
    });
  }

  const sortSelect = document.getElementById('toolbarSortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderProductsGrid();
    });
  }
}

function renderProductsGrid() {
  const grid = document.getElementById('products-page-grid');
  const countText = document.getElementById('showingCountText');
  if (!grid) return;

  let filtered = [...PRODUCTS_DATA];

  if (currentCategory !== 'all') {
    filtered = filtered.filter(p => p.category === currentCategory);
  }

  if (currentPriceRange === 'under-200k') {
    filtered = filtered.filter(p => p.price < 200000);
  } else if (currentPriceRange === '200k-500k') {
    filtered = filtered.filter(p => p.price >= 200000 && p.price <= 500000);
  } else if (currentPriceRange === '500k-1500k') {
    filtered = filtered.filter(p => p.price > 500000 && p.price <= 1500000);
  } else if (currentPriceRange === 'over-1500k') {
    filtered = filtered.filter(p => p.price > 1500000);
  }

  if (searchQuery) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchQuery) || 
      p.description.toLowerCase().includes(searchQuery) ||
      p.categoryName.toLowerCase().includes(searchQuery)
    );
  }

  if (currentSort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'newest') {
    filtered.sort((a, b) => b.id - a.id);
  }

  if (countText) {
    countText.textContent = `Hiển thị 1–${filtered.length} trên ${filtered.length} sản phẩm`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="card-animate" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #fff; border-radius: var(--radius-lg); border: 1px solid var(--gray-border);">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray-light)" stroke-width="1.5" style="margin-bottom: 12px;">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
        <h3 style="font-size: 1.1rem; color: var(--dark); margin-bottom: 6px;">Không tìm thấy sản phẩm phù hợp</h3>
        <p style="font-size: 0.88rem; color: var(--gray-muted);">Vui lòng thử chọn danh mục khác hoặc thay đổi từ khóa tìm kiếm.</p>
      </div>
    `;
    return;
  }

  const prefix = getAssetPrefix();

  grid.innerHTML = filtered.map((product, index) => {
    const isNew = product.id % 2 !== 0;
    const isDiscount = product.id === 3 || product.id === 6;
    const discountBadge = isDiscount ? `<span class="product-badge-discount">-15%</span>` : '';
    const newBadge = (isNew && !isDiscount) ? `<span class="product-badge-new">Mới</span>` : '';

    const isWishlisted = typeof wishlistManager !== 'undefined' && wishlistManager.isInWishlist(product.id);
    const heartSvg = isWishlisted 
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

    return `
      <div class="product-card card-animate" style="animation-delay: ${index * 0.03}s;">
        <div class="product-thumb">
          ${newBadge}
          ${discountBadge}
          <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" title="${isWishlisted ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}" onclick="handleWishlistToggle(event, ${product.id})">
            ${heartSvg}
          </button>
          <img src="${prefix}${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
          <h3 class="product-title" title="${product.name}">${product.name}</h3>
          <div class="product-price-row">
            <span class="product-price">${product.priceFormatted}</span>
            ${isDiscount ? `<span class="product-original-price">${(product.price * 1.18).toLocaleString('vi-VN')}đ</span>` : ''}
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
    `;
  }).join('');
}
