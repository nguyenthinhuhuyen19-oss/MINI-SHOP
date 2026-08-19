/**
 * Mini Shop - Login & Register Form Handler
 */

function getBasePath() {
  const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
  if (path.includes('/pages/admin/')) return '../../';
  if (path.includes('/pages/')) return '../';
  return './';
}

function showToast(message, isSuccess = true) {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
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

function fillDemo(type) {
  const emailInput = document.getElementById('loginEmail');
  const passInput = document.getElementById('loginPassword');

  if (!emailInput || !passInput) return;

  if (type === 'admin') {
    emailInput.value = 'admin@minishop.vn';
    passInput.value = 'admin123';
  } else {
    emailInput.value = 'user@minishop.vn';
    passInput.value = '123456';
  }
}

function handleLoginSubmit(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail')?.value.trim();
  const password = document.getElementById('loginPassword')?.value.trim();

  if (!email || !password) {
    showToast('Vui lòng nhập Email và Mật khẩu', false);
    return;
  }

  const userObj = authManager.login(email, password);
  const basePath = getBasePath();

  if (userObj.role === 'admin') {
    showToast('Đăng nhập Quản trị viên thành công! Đang chuyển hướng...', true);
    setTimeout(() => {
      window.location.href = `${basePath}pages/admin/dashboard.html`;
    }, 800);
  } else {
    showToast(`Xin chào ${userObj.name}! Đăng nhập thành công.`, true);
    setTimeout(() => {
      window.location.href = `${basePath}index.html`;
    }, 800);
  }
}

function handleRegisterSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('regFullName')?.value.trim();
  const email = document.getElementById('regEmail')?.value.trim();
  const pass = document.getElementById('regPassword')?.value.trim();
  const confirmPass = document.getElementById('regConfirmPassword')?.value.trim();

  if (!name || !email || !pass) {
    showToast('Vui lòng điền đầy đủ các thông tin bắt buộc', false);
    return;
  }

  if (pass !== confirmPass) {
    showToast('Mật khẩu xác nhận không khớp', false);
    return;
  }

  const userObj = authManager.register(name, email, pass);
  const basePath = getBasePath();

  showToast(`Đăng ký tài khoản thành công! Xin chào ${userObj.name}`, true);
  setTimeout(() => {
    window.location.href = `${basePath}index.html`;
  }, 800);
}
