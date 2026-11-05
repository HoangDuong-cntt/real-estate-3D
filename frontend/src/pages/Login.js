import { authApi } from '../api/auth';
import { authStore } from '../store/auth';
import { renderNavbar, bindNavbarEvents } from '../components/Navbar';
import { renderFooter } from '../components/Footer';

export async function LoginPage(container, params, router) {
  container.innerHTML = `
    ${renderNavbar()}
    <main class="page-container">
      <div class="auth-form-card">
        <h2 style="margin-bottom: 0.5rem; text-align: center;">Đăng Nhập</h2>
        <p style="text-align: center; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">
          Truy cập tài khoản để lưu yêu thích và đặt lịch xem nhà 3D
        </p>

        <div id="auth-error" class="hidden" style="background: rgba(239, 68, 68, 0.2); color: #f87171; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; font-size: 0.9rem;"></div>

        <form id="login-form">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" id="email" class="form-input" value="admin@realestate3d.vn" required />
          </div>
          <div class="form-group">
            <label class="form-label">Mật khẩu</label>
            <input type="password" id="password" class="form-input" value="admin123" required />
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">Đăng Nhập</button>
        </form>

        <div style="margin-top: 1.5rem; text-align: center; font-size: 0.9rem; color: var(--text-muted);">
          Chưa có tài khoản? <a href="/register" data-link style="color: var(--primary);">Đăng ký ngay</a>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;

  bindNavbarEvents(router);

  const form = document.getElementById('login-form');
  const errorBox = document.getElementById('auth-error');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.classList.add('hidden');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await authApi.login({ email, password });
      authStore.setAuth(res.data.user, res.data.token);

      if (res.data.user.role === 'admin') {
        router.navigate('/admin/dashboard');
      } else {
        router.navigate('/properties');
      }
    } catch (err) {
      errorBox.textContent =
        err.response?.data?.message || 'Đăng nhập không thành công, vui lòng kiểm tra lại.';
      errorBox.classList.remove('hidden');
    }
  });

  return () => {};
}

