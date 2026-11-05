import { authApi } from '../api/auth';
import { authStore } from '../store/auth';
import { renderNavbar, bindNavbarEvents } from '../components/Navbar';
import { renderFooter } from '../components/Footer';

export async function RegisterPage(container, params, router) {
  container.innerHTML = `
    ${renderNavbar()}
    <main class="page-container">
      <div class="auth-form-card">
        <h2 style="margin-bottom: 0.5rem; text-align: center;">Tạo Tài Khoản</h2>
        <p style="text-align: center; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">
          Đăng ký để trải nghiệm đầy đủ các tính năng 3D
        </p>

        <div id="auth-error" class="hidden" style="background: rgba(239, 68, 68, 0.2); color: #f87171; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; font-size: 0.9rem;"></div>

        <form id="register-form">
          <div class="form-group">
            <label class="form-label">Họ và tên</label>
            <input type="text" id="name" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" id="email" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Số điện thoại</label>
            <input type="tel" id="phone" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Mật khẩu</label>
            <input type="password" id="password" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Nhập lại mật khẩu</label>
            <input type="password" id="password_confirmation" class="form-input" required />
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">Đăng Ký</button>
        </form>

        <div style="margin-top: 1.5rem; text-align: center; font-size: 0.9rem; color: var(--text-muted);">
          Đã có tài khoản? <a href="/login" data-link style="color: var(--primary);">Đăng nhập</a>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;

  bindNavbarEvents(router);

  const form = document.getElementById('register-form');
  const errorBox = document.getElementById('auth-error');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.classList.add('hidden');

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const password_confirmation = document.getElementById('password_confirmation').value;

    if (password !== password_confirmation) {
      errorBox.textContent = 'Mật khẩu xác nhận không khớp.';
      errorBox.classList.remove('hidden');
      return;
    }

    try {
      const res = await authApi.register({
        name,
        email,
        phone,
        password,
        password_confirmation,
      });
      authStore.setAuth(res.data.user, res.data.token);
      router.navigate('/properties');
    } catch (err) {
      errorBox.textContent =
        err.response?.data?.message || 'Đăng ký không thành công, vui lòng thử lại.';
      errorBox.classList.remove('hidden');
    }
  });

  return () => {};
}

