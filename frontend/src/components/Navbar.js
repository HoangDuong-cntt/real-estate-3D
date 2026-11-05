import { authStore } from '../store/auth';

export function renderNavbar() {
  const isAuth = authStore.isAuthenticated();
  const isAdmin = authStore.isAdmin();
  const user = authStore.getUser();

  return `
    <header class="navbar">
      <div class="nav-container">
        <a href="/" data-link class="logo">
          <span class="logo-badge">3D</span>
          <span class="logo-text">RealEstate</span>
        </a>
        <nav class="nav-links">
          <a href="/" data-link class="nav-item">Trang chủ</a>
          <a href="/properties" data-link class="nav-item">Khám phá BĐS</a>
          <a href="/property/demo-3d" data-link class="nav-item">Trải nghiệm 3D</a>
          ${
            isAdmin
              ? `<a href="/admin/dashboard" data-link class="nav-item nav-admin">⚡ Admin Panel</a>`
              : ''
          }
        </nav>
        <div class="nav-auth">
          ${
            isAuth
              ? `
            <div class="user-menu">
              <span class="user-greeting">Xin chào, <strong>${user?.name || 'Khách'}</strong></span>
              <button id="logout-btn" class="btn btn-secondary btn-sm">Đăng xuất</button>
            </div>
          `
              : `
            <a href="/login" data-link class="btn btn-outline btn-sm">Đăng nhập</a>
            <a href="/register" data-link class="btn btn-primary btn-sm">Bắt đầu ngay</a>
          `
          }
        </div>
      </div>
    </header>
  `;
}

export function bindNavbarEvents(router) {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      authStore.clearAuth();
      router.navigate('/');
    });
  }
}
