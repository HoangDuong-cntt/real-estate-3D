import { adminApi } from '../../api/admin';
import { renderNavbar, bindNavbarEvents } from '../../components/Navbar';
import { renderFooter } from '../../components/Footer';

export async function AdminDashboardPage(container, params, router) {
  let properties = [];
  try {
    const res = await adminApi.getProperties();
    properties = res.data.data || [];
  } catch (err) {
    console.error('Lỗi tải BĐS admin:', err);
  }

  container.innerHTML = `
    ${renderNavbar()}
    <main class="page-container">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div>
          <h1>Bảng Điều Khiển Quản Trị</h1>
          <p class="text-muted">Quản lý bất động sản, mô hình 3D, người dùng và yêu cầu khách hàng</p>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <a href="/admin/properties/create" data-link class="btn btn-primary btn-sm">+ Thêm BĐS Mới</a>
          <a href="/admin/inquiries" data-link class="btn btn-outline btn-sm">Xem Yêu Cầu</a>
          <a href="/admin/users" data-link class="btn btn-outline btn-sm">Người Dùng</a>
        </div>
      </div>

      <div class="card" style="padding: 1.5rem; overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border); color: var(--text-muted);">
              <th style="padding: 0.75rem;">Tiêu đề</th>
              <th style="padding: 0.75rem;">Loại</th>
              <th style="padding: 0.75rem;">Giá</th>
              <th style="padding: 0.75rem;">Mô hình 3D</th>
              <th style="padding: 0.75rem;">Trạng thái</th>
              <th style="padding: 0.75rem; text-align: right;">Hành động</th>
            </tr>
          </thead>
          <tbody>
            ${
              properties.length === 0
                ? `<tr><td colspan="6" style="padding: 2rem; text-align: center;">Chưa có bất động sản nào. Nhấp "+ Thêm BĐS Mới" để tạo.</td></tr>`
                : properties
                    .map(
                      (p) => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <td style="padding: 0.75rem; font-weight: 500;">${p.title}</td>
                  <td style="padding: 0.75rem;">${p.type?.name || 'N/A'}</td>
                  <td style="padding: 0.75rem; color: #38bdf8;">${p.price ? `${(p.price / 1000000000).toFixed(2)} tỷ` : 'Chưa công bố'}</td>
                  <td style="padding: 0.75rem;">
                    ${
                      p.models?.length
                        ? `<span style="color: #4ade80;">✅ Có (${p.models.length})</span>`
                        : `<span style="color: #f87171;">❌ Chưa có</span>`
                    }
                  </td>
                  <td style="padding: 0.75rem;">
                    <span style="background: rgba(59,130,246,0.2); color: #60a5fa; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">
                      ${p.status}
                    </span>
                  </td>
                  <td style="padding: 0.75rem; text-align: right; display: flex; gap: 0.5rem; justify-content: flex-end;">
                    <a href="/admin/properties/${p.id}/upload-model" data-link class="btn btn-primary btn-sm">🎮 Upload 3D</a>
                    <button data-delete-id="${p.id}" class="btn btn-secondary btn-sm delete-prop-btn" style="background: #dc2626;">Xóa</button>
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

  container.querySelectorAll('.delete-prop-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-delete-id');
      if (confirm('Bạn có chắc muốn xóa bất động sản này và toàn bộ mô hình 3D liên quan?')) {
        try {
          await adminApi.deleteProperty(id);
          router.navigate('/admin/dashboard');
        } catch (err) {
          alert('Không thể xóa: ' + (err.response?.data?.message || err.message));
        }
      }
    });
  });

  return () => {};
}
