/**
 * Mini Shop - Admin Order Management Script
 */

const sampleOrders = [
  {
    id: '#MS-94820',
    customer: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '123 Đường Lê Lợi, Q.1, TP.HCM',
    date: '16/08/2026',
    itemsCount: 2,
    total: '580.000đ',
    status: 'Completed'
  },
  {
    id: '#MS-83912',
    customer: 'Trần Thị B',
    phone: '0987654321',
    address: '456 Phố Huế, Q.Hai Bà Trưng, Hà Nội',
    date: '15/08/2026',
    itemsCount: 1,
    total: '290.000đ',
    status: 'Processing'
  },
  {
    id: '#MS-71934',
    customer: 'Lê Hoàng C',
    phone: '0905112233',
    address: '78 Nguyễn Văn Linh, Q.Hải Châu, Đà Nẵng',
    date: '14/08/2026',
    itemsCount: 3,
    total: '1.290.000đ',
    status: 'Shipping'
  },
  {
    id: '#MS-62810',
    customer: 'Phạm Minh D',
    phone: '0944889900',
    address: '12 Trần Phú, Q.Ninh Kiều, Cần Thơ',
    date: '12/08/2026',
    itemsCount: 1,
    total: '199.000đ',
    status: 'Cancelled'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  renderAdminOrdersTable();
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

function renderAdminOrdersTable() {
  const tbody = document.getElementById('adminOrdersTableBody');
  if (!tbody) return;

  tbody.innerHTML = sampleOrders.map((order, idx) => {
    let statusBadge = '';
    if (order.status === 'Completed') {
      statusBadge = `<span class="badge-status-completed">Hoàn thành</span>`;
    } else if (order.status === 'Processing') {
      statusBadge = `<span class="badge-status-processing">Đang xử lý</span>`;
    } else if (order.status === 'Shipping') {
      statusBadge = `<span class="badge-status-processing" style="background:#fef3c7; color:#d97706;">Đang giao hàng</span>`;
    } else {
      statusBadge = `<span class="badge-status-cancelled">Đã hủy</span>`;
    }

    return `
      <tr>
        <td style="font-weight: 700; color: var(--gray-muted);">${idx + 1}</td>
        <td style="font-weight: 800; color: var(--primary);">${order.id}</td>
        <td>
          <div style="font-weight: 700; color: var(--dark);">${order.customer}</div>
          <div style="font-size: 0.78rem; color: var(--gray-muted);">${order.phone}</div>
        </td>
        <td style="font-size: 0.82rem; color: var(--dark-muted); max-width: 220px;">${order.address}</td>
        <td style="font-size: 0.82rem; color: var(--gray-muted);">${order.date}</td>
        <td style="font-weight: 600;">${order.itemsCount} món</td>
        <td style="font-weight: 800; color: var(--dark);">${order.total}</td>
        <td>${statusBadge}</td>
        <td>
          <button class="btn-action-edit" onclick="showAdminToast('Đang cập nhật trạng thái đơn ${order.id}')">
            Chi tiết
          </button>
        </td>
      </tr>
    `;
  }).join('');
}
