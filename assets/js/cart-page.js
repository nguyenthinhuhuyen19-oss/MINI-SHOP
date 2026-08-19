/**
 * Mini Shop - Shopping Cart Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  renderCartPage();

  window.addEventListener('cart-updated', () => {
    renderCartPage();
  });
});

function getAssetPrefix() {
  const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
  if (path.includes('/pages/admin/')) return '../../';
  if (path.includes('/pages/')) return '../';
  return './';
}

function renderCartPage() {
  const cartContainer = document.getElementById('cartPageContainer');
  if (!cartContainer) return;

  const cart = cartManager.getCart();

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart-card card-animate">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--gray-light)" stroke-width="1.5" style="margin-bottom: 16px;">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
          <path d="M3 6h18"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <h2 style="font-size: 1.4rem; color: var(--dark); margin-bottom: 8px;">Giỏ hàng của bạn đang trống</h2>
        <p style="font-size: 0.9rem; color: var(--gray-muted); margin-bottom: 24px;">Hãy khám phá thêm hàng trăm sản phẩm decor độc đáo tại Mini Shop.</p>
        <a href="products.html" class="btn-hero" style="text-decoration: none;">Khám phá sản phẩm</a>
      </div>
    `;
    return;
  }

  const prefix = getAssetPrefix();
  const subtotal = cartManager.getCartSubtotal();
  const shippingFee = (subtotal >= 500000 || subtotal === 0) ? 0 : 30000;
  const grandTotal = subtotal + shippingFee;

  cartContainer.innerHTML = `
    <div class="cart-layout-grid card-animate">
      <!-- Left Cart Items Table -->
      <div class="cart-table-wrapper">
        <table class="cart-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
              <th style="width: 50px;"></th>
            </tr>
          </thead>
          <tbody>
            ${cart.map(item => `
              <tr>
                <td>
                  <div class="cart-item-flex">
                    <img src="${prefix}${item.image}" alt="${item.name}" class="cart-item-thumb">
                    <div>
                      <h4 class="cart-item-name">${item.name}</h4>
                    </div>
                  </div>
                </td>
                <td style="font-weight: 600; color: var(--dark-muted);">${item.priceFormatted}</td>
                <td>
                  <div class="qty-control" style="transform: scale(0.9); transform-origin: left center;">
                    <button class="qty-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="text" class="qty-input" value="${item.quantity}" readonly>
                    <button class="qty-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                  </div>
                </td>
                <td style="font-weight: 800; color: var(--primary);">${(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
                <td>
                  <button class="btn-remove-item" title="Xóa khỏi giỏ hàng" onclick="cartManager.removeFromCart(${item.id})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Right Order Summary Box -->
      <div class="cart-summary-box">
        <h3 class="summary-title">Tóm tắt đơn hàng</h3>
        
        <div class="summary-row">
          <span>Tạm tính:</span>
          <span style="font-weight: 700; color: var(--dark);">${subtotal.toLocaleString('vi-VN')}đ</span>
        </div>
        
        <div class="summary-row">
          <span>Phí vận chuyển:</span>
          <span style="font-weight: 700; color: ${shippingFee === 0 ? 'var(--primary)' : 'var(--dark)'};">
            ${shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')}đ`}
          </span>
        </div>

        ${subtotal < 500000 ? `
          <div style="font-size: 0.78rem; color: var(--blue-btn); background: var(--blue-light); padding: 8px 12px; border-radius: var(--radius-sm); margin-bottom: 16px;">
            Mua thêm <strong>${(500000 - subtotal).toLocaleString('vi-VN')}đ</strong> để được Miễn phí vận chuyển!
          </div>
        ` : ''}

        <div class="summary-row total">
          <span>Tổng cộng:</span>
          <span class="total-amount">${grandTotal.toLocaleString('vi-VN')}đ</span>
        </div>

        <button class="btn-checkout" onclick="window.location.href='checkout.html'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          Thanh toán ngay
        </button>
      </div>
    </div>
  `;
}
