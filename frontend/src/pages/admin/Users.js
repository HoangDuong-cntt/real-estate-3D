import { adminApi } from '../../api/admin';
import { renderNavbar, bindNavbarEvents } from '../../components/Navbar';
import { renderFooter } from '../../components/Footer';

export async function AdminUsersPage(container, params, router) {
  let users = [];
  try {
    const res = await adminApi.getUsers();
    users = res.data.data || [];
  } catch (err) {
    console.error(err);
  }

  container.innerHTML = `
    ${renderNavbar()}
    <main class="page-container">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div>
          <h2>Quản Lý Người Dùng</h2>
          <p class="text-muted">Danh sách tài khoản khách hàng và quản trị viên</p>
        </div>
        <a href="/admin/dashboard" data-link class="btn btn-outline btn-sm">&larr; Bảng điều khiển</a>
      </div>

      <div class="card" style="padding: 1.5rem; overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border); color: var(--text-muted);">
              <th style="padding: 0.75rem;">ID</th>
              <th style="padding: 0.75rem;">Họ Tên</th>
              <th style="padding: 0.75rem;">Email</th>
              <th style="padding: 0.75rem;">Số điện thoại</th>
              <th style="padding: 0.75rem;">Vai trò</th>
              <th style="padding: 0.75rem; text-align: right;">Hành động</th>
            </tr>
          </thead>
          <tbody>
            ${
              users.length === 0
                ? `<tr><td colspan="6" style="padding: 2rem; text-align: center;">Chưa có người dùng nào.</td></tr>`
                : users
                    .map(
                      (u) => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <td style="padding: 0.75rem;">#${u.id}</td>
                  <td style="padding: 0.75rem; font-weight: 500;">${u.name}</td>
                  <td style="padding: 0.75rem;">${u.email}</td>
                  <td style="padding: 0.75rem;">${u.phone || 'Chưa cập nhật'}</td>
                  <td style="padding: 0.75rem;">
                    <span style="padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; background: ${
                      u.role === 'admin' ? 'rgba(59,130,246,0.2)' : 'rgba(16,185,129,0.2)'
                    }; color: ${u.role === 'admin' ? '#60a5fa' : '#34d399'};">
                      ${u.role}
                    </span>
                  </td>
                  <td style="padding: 0.75rem; text-align: right;">
                    <button data-user-id="${u.id}" data-current-role="${u.role}" class="btn btn-outline btn-sm toggle-role-btn">
                      Đổi thành ${u.role === 'admin' ? 'customer' : 'admin'}
                    </button>
                  </td>
                </tr>
              `
                    )
                    .join('')
            }
          </tbody>
        </table>
      </div>
    </main>
    ${renderFooter()}
  `;

  bindNavbarEvents(router);

  container.querySelectorAll('.toggle-role-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-user-id');
      const currentRole = btn.getAttribute('data-current-role');
      const newRole = currentRole === 'admin' ? 'customer' : 'admin';
      try {
        await adminApi.updateUserRole(id, newRole);
        alert('Cập nhật quyền thành công!');
        router.navigate('/admin/users');
      } catch (err) {
        alert('Lỗi: ' + (err.response?.data?.message || err.message));
      }
    });
  });

  return () => {};
}

