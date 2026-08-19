/**
 * Mini Shop - Checkout & Order Placement Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutPage();
});

function getAssetPrefix() {
  const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
  if (path.includes('/pages/admin/')) return '../../';
  if (path.includes('/pages/')) return '../';
  return './';
}

function renderCheckoutPage() {
  const container = document.getElementById('checkoutPageContainer');
  if (!container) return;

  const cart = cartManager.getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-card card-animate">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--gray-light)" stroke-width="1.5" style="margin-bottom: 16px;">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
          <path d="M3 6h18"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <h2 style="font-size: 1.4rem; color: var(--dark); margin-bottom: 8px;">Giỏ hàng của bạn đang trống</h2>
        <p style="font-size: 0.9rem; color: var(--gray-muted); margin-bottom: 24px;">Không thể tiến hành thanh toán vì chưa có sản phẩm nào trong giỏ hàng.</p>
        <a href="products.html" class="btn-hero" style="text-decoration: none;">Khám phá sản phẩm ngay</a>
      </div>
    `;
    return;
  }

  const prefix = getAssetPrefix();
  const subtotal = cartManager.getCartSubtotal();
  const shippingFee = (subtotal >= 500000 || subtotal === 0) ? 0 : 30000;
  const grandTotal = subtotal + shippingFee;

  container.innerHTML = `
    <div class="checkout-layout-grid card-animate">
      <!-- Left Form Column -->
      <div class="checkout-form-card">
        <h2 class="checkout-section-title">Thông tin giao hàng</h2>
        <form id="checkoutForm" onsubmit="handlePlaceOrder(event)">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Họ và tên <span class="required">*</span></label>
              <input type="text" class="form-input" id="checkoutFullName" placeholder="Nhập họ và tên người nhận" required>
            </div>
            <div class="form-group">
              <label class="form-label">Số điện thoại <span class="required">*</span></label>
              <input type="tel" class="form-input" id="checkoutPhone" placeholder="Nhập số điện thoại liên hệ" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email (không bắt buộc)</label>
            <input type="email" class="form-input" id="checkoutEmail" placeholder="nguyenvana@gmail.com">
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Tỉnh / Thành phố <span class="required">*</span></label>
              <select class="form-select" id="checkoutCity" required>
                <option value="Hà Nội">Hà Nội</option>
                <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Hải Phòng">Hải Phòng</option>
                <option value="Cần Thơ">Cần Thơ</option>
                <option value="Khác">Tỉnh / Thành phố khác</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Quận / Huyện / Địa chỉ cụ thể <span class="required">*</span></label>
              <input type="text" class="form-input" id="checkoutAddress" placeholder="Số nhà, tên đường, phường/xã" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Ghi chú đơn hàng (không bắt buộc)</label>
            <textarea class="form-textarea" id="checkoutNotes" rows="3" placeholder="Ghi chú về thời gian giao hàng hoặc chỉ dẫn chi tiết..."></textarea>
          </div>

          <h2 class="checkout-section-title" style="margin-top: 32px;">Phương thức thanh toán</h2>
          <div class="payment-options-list">
            <label class="payment-option-box active">
              <input type="radio" name="paymentMethod" value="COD" checked>
              <div>
                <div class="payment-title">Thanh toán khi nhận hàng (COD)</div>
                <div class="payment-desc">Thanh toán bằng tiền mặt trực tiếp cho shipper khi nhận hàng.</div>
              </div>
            </label>

            <label class="payment-option-box">
              <input type="radio" name="paymentMethod" value="BANK">
              <div>
                <div class="payment-title">Chuyển khoản ngân hàng (QR Code)</div>
                <div class="payment-desc">Quét mã QR qua ứng dụng Ngân hàng (VietQR / Techcombank / MB).</div>
              </div>
            </label>

            <label class="payment-option-box">
              <input type="radio" name="paymentMethod" value="MOMO">
              <div>
                <div class="payment-title">Ví điện tử MoMo / ZaloPay</div>
                <div class="payment-desc">Thanh toán nhanh chóng và an toàn qua ứng dụng Ví điện tử.</div>
              </div>
            </label>
          </div>

          <button type="submit" class="btn-checkout" style="margin-top: 32px; padding: 16px; font-size: 1.05rem;" id="btnSubmitOrder">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Xác nhận đặt hàng
          </button>
        </form>
      </div>

      <!-- Right Summary Column -->
      <div class="cart-summary-box">
        <h3 class="summary-title">Đơn hàng của bạn (${cart.length} sản phẩm)</h3>
        
        <div style="margin-bottom: 20px; max-height: 320px; overflow-y: auto; padding-right: 4px;">
          ${cart.map(item => `
            <div class="checkout-summary-item">
              <div style="display: flex; align-items: center; gap: 12px;">
                <img src="${prefix}${item.image}" alt="${item.name}" class="checkout-item-thumb">
                <div>
                  <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--dark); margin-bottom: 2px;">${item.name}</h4>
                  <div style="font-size: 0.78rem; color: var(--gray-muted);">Số lượng: ${item.quantity}</div>
                </div>
              </div>
              <span style="font-size: 0.88rem; font-weight: 700; color: var(--dark);">${(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
            </div>
          `).join('')}
        </div>

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

        <div class="summary-row total">
          <span>Tổng thành tiền:</span>
          <span class="total-amount">${grandTotal.toLocaleString('vi-VN')}đ</span>
        </div>
      </div>
    </div>
  `;
}

function handlePlaceOrder(event) {
  event.preventDefault();

  const fullName = document.getElementById('checkoutFullName').value.trim();
  const phone = document.getElementById('checkoutPhone').value.trim();
  const city = document.getElementById('checkoutCity').value;
  const address = document.getElementById('checkoutAddress').value.trim();

  if (!fullName || !phone || !address) {
    alert('Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng.');
    return;
  }

  const subtotal = cartManager.getCartSubtotal();
  const shippingFee = (subtotal >= 500000 || subtotal === 0) ? 0 : 30000;
  const grandTotal = subtotal + shippingFee;
  const orderCode = `#MS-${Math.floor(10000 + Math.random() * 90000)}`;

  // Clear cart
  cartManager.clearCart();

  // Render Order Success Screen
  const container = document.getElementById('checkoutPageContainer');
  if (container) {
    container.innerHTML = `
      <div class="order-success-card card-animate">
        <div class="success-icon-box">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--dark); margin-bottom: 8px;">Đặt hàng thành công!</h2>
        <p style="font-size: 0.95rem; color: var(--gray-muted); margin-bottom: 24px;">Cảm ơn <strong>${fullName}</strong> đã mua sắm tại Mini Shop. Đơn hàng của bạn đang được xử lý.</p>
        
        <div style="background: var(--gray-bg); border-radius: var(--radius-lg); border: 1px solid var(--gray-border); padding: 20px; text-align: left; margin-bottom: 28px; font-size: 0.9rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: var(--gray-muted);">Mã đơn hàng:</span>
            <strong style="color: var(--primary);">${orderCode}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: var(--gray-muted);">Người nhận:</span>
            <strong>${fullName} (${phone})</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: var(--gray-muted);">Địa chỉ giao hàng:</span>
            <strong>${address}, ${city}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: var(--gray-muted);">Tổng thanh toán:</span>
            <strong style="color: var(--primary); font-size: 1.05rem;">${grandTotal.toLocaleString('vi-VN')}đ</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--gray-muted);">Dự kiến giao hàng:</span>
            <strong>2 - 3 ngày làm việc</strong>
          </div>
        </div>

        <div style="display: flex; gap: 16px; justify-content: center;">
          <a href="../index.html" class="btn-hero" style="text-decoration: none;">Trở về Trang chủ</a>
          <a href="products.html" class="btn-login" style="padding: 14px 24px; border-radius: var(--radius-md); text-decoration: none;">Tiếp tục mua sắm</a>
        </div>
      </div>
    `;
  }
}
