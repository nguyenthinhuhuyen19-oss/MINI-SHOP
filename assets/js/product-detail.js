/**
 * Mini Shop - Product Detail Page Script
 */

let selectedQuantity = 1;
let currentProduct = null;

document.addEventListener('DOMContentLoaded', () => {
  loadProductDetails();

  window.addEventListener('wishlist-updated', () => {
    updateDetailWishlistButton();
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

function updateDetailWishlistButton() {
  const btnWishlist = document.getElementById('btnDetailWishlist');
  if (!btnWishlist || !currentProduct || typeof wishlistManager === 'undefined') return;

  const isFavorited = wishlistManager.isInWishlist(currentProduct.id);
  if (isFavorited) {
    btnWishlist.classList.add('active');
    btnWishlist.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      Đã yêu thích
    `;
  } else {
    btnWishlist.classList.remove('active');
    btnWishlist.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      Yêu thích
    `;
  }
}

function loadProductDetails() {
  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get('id')) || 1;

  currentProduct = PRODUCTS_DATA.find(p => p.id === productId) || PRODUCTS_DATA[0];
  const prefix = getAssetPrefix();

  document.title = `Mini Shop - ${currentProduct.name}`;
  const breadcrumbCat = document.getElementById('breadcrumbCategory');
  const breadcrumbTitle = document.getElementById('breadcrumbTitle');
  if (breadcrumbCat) breadcrumbCat.textContent = currentProduct.categoryName;
  if (breadcrumbTitle) breadcrumbTitle.textContent = currentProduct.name;

  const galleryMain = document.getElementById('galleryMainImg');
  const galleryThumbs = document.getElementById('galleryThumbsList');

  const galleryImages = [
    currentProduct.image,
    "assets/images/products/San_pham/binh-gom-trang-tri-original.webp",
    "assets/images/products/San_pham/hero-home-decor-pexels-original.webp",
    "assets/images/products/do-my-nghe/bo-binh-gom-minimal.webp"
  ];

  if (galleryMain) {
    galleryMain.src = prefix + currentProduct.image;
    galleryMain.alt = currentProduct.name;
  }

  if (galleryThumbs) {
    galleryThumbs.innerHTML = galleryImages.map((imgSrc, idx) => `
      <img src="${prefix}${imgSrc}" 
           alt="Thumb ${idx + 1}" 
           class="thumb-img ${idx === 0 ? 'active' : ''}" 
           onclick="switchMainImage(this, '${prefix}${imgSrc}')">
    `).join('');
  }

  const titleEl = document.getElementById('detailProductTitle');
  const catTagEl = document.getElementById('detailCategoryTag');
  const priceEl = document.getElementById('detailCurrentPrice');
  const oldPriceEl = document.getElementById('detailOldPrice');
  const discountEl = document.getElementById('detailDiscountTag');
  const descEl = document.getElementById('detailDescription');

  if (titleEl) titleEl.textContent = currentProduct.name;
  if (catTagEl) catTagEl.textContent = currentProduct.categoryName;
  if (priceEl) priceEl.textContent = currentProduct.priceFormatted;

  const originalPriceVal = Math.round(currentProduct.price * 1.22);
  if (oldPriceEl) oldPriceEl.textContent = `${originalPriceVal.toLocaleString('vi-VN')}đ`;
  if (discountEl) discountEl.textContent = '-18%';
  if (descEl) descEl.textContent = `${currentProduct.description}. Sản phẩm cao cấp mang đến vẻ đẹp tinh tế, hiện đại cho không gian sống của bạn. Hàng chính hãng phân phối tại Mini Shop.`;

  const qtyInput = document.getElementById('qtyInput');
  const btnMinus = document.getElementById('qtyBtnMinus');
  const btnPlus = document.getElementById('qtyBtnPlus');

  if (btnMinus) {
    btnMinus.addEventListener('click', () => {
      if (selectedQuantity > 1) {
        selectedQuantity--;
        if (qtyInput) qtyInput.value = selectedQuantity;
      }
    });
  }

  if (btnPlus) {
    btnPlus.addEventListener('click', () => {
      selectedQuantity++;
      if (qtyInput) qtyInput.value = selectedQuantity;
    });
  }

  const btnAddToCart = document.getElementById('btnAddToCart');
  if (btnAddToCart) {
    btnAddToCart.addEventListener('click', () => {
      if (typeof cartManager !== 'undefined') {
        cartManager.addToCart(currentProduct.id, selectedQuantity);
        showToast(`Đã thêm ${selectedQuantity} x ${currentProduct.name} vào giỏ hàng!`, false);
      }
    });
  }

  const btnWishlist = document.getElementById('btnDetailWishlist');
  if (btnWishlist) {
    btnWishlist.addEventListener('click', () => {
      if (typeof wishlistManager !== 'undefined') {
        const isAdded = wishlistManager.toggleWishlist(currentProduct.id);
        if (isAdded) {
          showToast(`Đã thêm ${currentProduct.name} vào danh sách yêu thích`, true);
        } else {
          showToast(`Đã xóa ${currentProduct.name} khỏi danh sách yêu thích`, false);
        }
      }
    });
  }

  updateDetailWishlistButton();
  renderRelatedProducts();
}

function switchMainImage(thumbEl, newSrc) {
  document.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('active'));
  thumbEl.classList.add('active');
  const mainImg = document.getElementById('galleryMainImg');
  if (mainImg) {
    mainImg.style.opacity = '0.3';
    setTimeout(() => {
      mainImg.src = newSrc;
      mainImg.style.opacity = '1';
    }, 150);
  }
}

function renderRelatedProducts() {
  const container = document.getElementById('relatedProductsGrid');
  if (!container || !currentProduct) return;

  const related = PRODUCTS_DATA.filter(p => p.id !== currentProduct.id).slice(0, 5);
  const prefix = getAssetPrefix();

  container.innerHTML = related.map(product => {
    const isWishlisted = typeof wishlistManager !== 'undefined' && wishlistManager.isInWishlist(product.id);
    return `
      <div class="product-card">
        <div class="product-thumb">
          <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" title="${isWishlisted ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}" onclick="handleDetailRelatedWishlistToggle(event, ${product.id})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${isWishlisted ? '#ef4444' : 'none'}" stroke="${isWishlisted ? '#ef4444' : 'currentColor'}" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <img src="${prefix}${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <div class="product-price">${product.priceFormatted}</div>
          <p class="product-desc">${product.description}</p>
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

function handleDetailRelatedWishlistToggle(event, productId) {
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
