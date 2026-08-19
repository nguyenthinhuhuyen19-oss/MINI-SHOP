/**
 * Mini Shop - Admin Product & Category Management Script
 * Handles in-memory CRUD (Add, Edit, Delete) with instant UI re-rendering
 */

let adminProductsList = [];
let editingProductId = null;

const CATEGORY_MAP = {
  'noi-that': 'Nội thất',
  'trang-tri': 'Trang trí',
  'nha-bep': 'Nhà bếp',
  'den': 'Đèn',
  'luu-tru': 'Lưu trữ',
  'van-phong': 'Văn phòng'
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize with PRODUCTS_DATA copy
  if (typeof PRODUCTS_DATA !== 'undefined') {
    adminProductsList = [...PRODUCTS_DATA];
  }
  renderAdminProductsTable();
  renderAdminCategoriesTable();
  renderAdminQuickSummary();
});

function showAdminToast(message, isSuccess = true) {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.style.zIndex = '99999';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${isSuccess ? '#16a34a' : '#ef4444'}" stroke-width="2.5">
      ${isSuccess 
        ? '<polyline points="20 6 9 17 4 12"/>' 
        : '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'}
    </svg>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function renderAdminQuickSummary() {
  const container = document.getElementById('adminQuickSummaryBox');
  if (!container) return;

  const totalProducts = adminProductsList.length;
  const categoriesCount = Object.keys(CATEGORY_MAP).length;

  container.innerHTML = `
    <div class="quick-summary-title">Quick Summary</div>
    <div class="quick-summary-item">
      <span>Products</span>
      <span class="quick-val">${totalProducts}</span>
    </div>
    <div class="quick-summary-item">
      <span>Categories</span>
      <span class="quick-val">${categoriesCount}</span>
    </div>
    <div class="quick-summary-item">
      <span>Orders</span>
      <span class="quick-val">18</span>
    </div>
    <div class="quick-summary-item">
      <span>Users</span>
      <span class="quick-val">24</span>
    </div>
  `;
}

function renderAdminProductsTable() {
  const tbody = document.getElementById('adminProductsTableBody');
  const countText = document.getElementById('adminProductCountText');
  if (!tbody) return;

  if (countText) {
    countText.textContent = `Showing 1 to ${adminProductsList.length} of ${adminProductsList.length} results`;
  }

  tbody.innerHTML = adminProductsList.map((product, index) => `
    <tr>
      <td style="font-weight: 700; color: var(--gray-muted);">${index + 1}</td>
      <td>
        <img src="../../${product.image}" alt="${product.name}" style="width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--admin-border);">
      </td>
      <td style="font-weight: 700; color: var(--dark);">${product.name}</td>
      <td>
        <span style="font-size: 0.78rem; font-weight: 600; color: var(--blue-btn); background: #eff6ff; padding: 3px 10px; border-radius: var(--radius-full);">
          ${product.categoryName}
        </span>
      </td>
      <td style="font-weight: 800; color: var(--dark);">${product.priceFormatted}</td>
      <td><span class="badge-status-active">Active</span></td>
      <td>
        <div style="display: flex; gap: 8px;">
          <button class="btn-action-edit" onclick="editAdminProduct(${product.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
          <button class="btn-action-delete" onclick="deleteAdminProduct(${product.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            Delete
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  renderAdminQuickSummary();
}

function renderAdminCategoriesTable() {
  const tbody = document.getElementById('adminCategoriesTableBody');
  if (!tbody) return;

  const categoryCounts = {};
  adminProductsList.forEach(p => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  const categories = [
    { key: 'noi-that', name: 'Furniture', count: categoryCounts['noi-that'] || 0 },
    { key: 'trang-tri', name: 'Decor', count: categoryCounts['trang-tri'] || 0 },
    { key: 'nha-bep', name: 'Kitchen', count: categoryCounts['nha-bep'] || 0 },
    { key: 'den', name: 'Lighting', count: categoryCounts['den'] || 0 },
    { key: 'luu-tru', name: 'Storage', count: categoryCounts['luu-tru'] || 0 },
    { key: 'van-phong', name: 'Office', count: categoryCounts['van-phong'] || 0 }
  ];

  tbody.innerHTML = categories.map((cat, idx) => `
    <tr>
      <td style="font-weight: 700; color: var(--gray-muted);">${idx + 1}</td>
      <td style="font-weight: 700; color: var(--dark);">${cat.name}</td>
      <td style="font-weight: 600; color: var(--gray-muted);">${cat.count} products</td>
      <td><span class="badge-status-active">Active</span></td>
      <td>
        <div style="display: flex; gap: 8px;">
          <button class="btn-action-edit" onclick="showAdminToast('Chức năng sửa danh mục đang hoạt động')">Edit</button>
          <button class="btn-action-delete" onclick="showAdminToast('Chức năng xóa danh mục đang hoạt động')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function editAdminProduct(productId) {
  const p = adminProductsList.find(item => item.id === productId);
  if (!p) return;

  editingProductId = productId;

  document.getElementById('formTitleText').textContent = `Chỉnh sửa: ${p.name}`;
  document.getElementById('formBtnSave').textContent = 'Lưu thay đổi';

  document.getElementById('productNameInput').value = p.name;
  document.getElementById('productCategorySelect').value = p.category;
  document.getElementById('productPriceInput').value = p.price;
  document.getElementById('productDescInput').value = p.description;

  showAdminToast(`Đã tải dữ liệu ${p.name} lên Form`, true);
}

function deleteAdminProduct(productId) {
  const p = adminProductsList.find(item => item.id === productId);
  const name = p ? p.name : 'Sản phẩm';

  adminProductsList = adminProductsList.filter(item => item.id !== productId);
  renderAdminProductsTable();
  renderAdminCategoriesTable();

  if (editingProductId === productId) {
    resetProductForm();
  }

  showAdminToast(`Đã xóa ${name} khỏi hệ thống`, false);
}

function resetProductForm() {
  editingProductId = null;
  document.getElementById('formTitleText').textContent = 'Thêm Sản Phẩm Mới';
  document.getElementById('formBtnSave').textContent = 'Lưu sản phẩm';
  document.getElementById('adminProductForm').reset();
}

function handleAdminProductSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('productNameInput').value.trim();
  const category = document.getElementById('productCategorySelect').value;
  const price = Number(document.getElementById('productPriceInput').value);
  const desc = document.getElementById('productDescInput').value.trim();

  if (!name || !price) {
    showAdminToast('Vui lòng nhập Tên sản phẩm và Giá bán', false);
    return;
  }

  const categoryName = CATEGORY_MAP[category] || 'Khác';
  const priceFormatted = `${price.toLocaleString('vi-VN')}đ`;

  if (editingProductId !== null) {
    // Update existing product
    const index = adminProductsList.findIndex(p => p.id === editingProductId);
    if (index !== -1) {
      adminProductsList[index] = {
        ...adminProductsList[index],
        name,
        category,
        categoryName,
        price,
        priceFormatted,
        description: desc || adminProductsList[index].description
      };
      showAdminToast(`Đã cập nhật sản phẩm "${name}" thành công!`, true);
    }
  } else {
    // Add new product
    const newProduct = {
      id: Date.now(),
      name,
      category,
      categoryName,
      price,
      priceFormatted,
      image: 'assets/images/products/San_pham/binh-gom-trang-tri-original.webp',
      description: desc || 'Sản phẩm thủ công cao cấp được phân phối chính hãng.'
    };
    adminProductsList.unshift(newProduct);
    showAdminToast(`Đã thêm sản phẩm "${name}" mới!`, true);
  }

  resetProductForm();
  renderAdminProductsTable();
  renderAdminCategoriesTable();
}
