import { adminApi } from '../../api/admin';
import { renderNavbar, bindNavbarEvents } from '../../components/Navbar';
import { renderFooter } from '../../components/Footer';

export async function AdminInquiriesPage(container, params, router) {
  let inquiries = [];
  try {
    const res = await adminApi.getInquiries();
    inquiries = res.data.data || [];
  } catch (err) {
    console.error(err);
  }

  container.innerHTML = `
    ${renderNavbar()}
    <main class="page-container">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div>
          <h2>Yêu Cầu & Lịch Xem Nhà</h2>
          <p class="text-muted">Danh sách khách hàng để lại thông tin quan tâm hoặc hẹn lịch xem nhà</p>
        </div>
        <a href="/admin/dashboard" data-link class="btn btn-outline btn-sm">&larr; Bảng điều khiển</a>
      </div>

      <div class="card" style="padding: 1.5rem; overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border); color: var(--text-muted);">
              <th style="padding: 0.75rem;">ID</th>
              <th style="padding: 0.75rem;">Khách hàng</th>
              <th style="padding: 0.75rem;">Bất động sản</th>
              <th style="padding: 0.75rem;">Lời nhắn / Thời gian hẹn</th>
              <th style="padding: 0.75rem;">Trạng thái</th>
              <th style="padding: 0.75rem; text-align: right;">Hành động</th>
            </tr>
          </thead>
          <tbody>
            ${
              inquiries.length === 0
                ? `<tr><td colspan="6" style="padding: 2rem; text-align: center;">Chưa có yêu cầu nào từ khách hàng.</td></tr>`
                : inquiries
                    .map(
                      (inq) => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <td style="padding: 0.75rem;">#${inq.id}</td>
                  <td style="padding: 0.75rem;">
                    <strong>${inq.user?.name || 'Khách vãng lai'}</strong><br/>
                    <small style="color: var(--text-muted);">${inq.user?.phone || inq.user?.email || ''}</small>
                  </td>
                  <td style="padding: 0.75rem; font-weight: 500;">${inq.property?.title || 'N/A'}</td>
                  <td style="padding: 0.75rem;">
                    <div>${inq.message}</div>
                    ${
                      inq.preferred_time
                        ? `<small style="color: #60a5fa;">📅 Hẹn lúc: ${new Date(
                            inq.preferred_time
                          ).toLocaleString('vi-VN')}</small>`
                        : ''
                    }
                  </td>
                  <td style="padding: 0.75rem;">
                    <select data-inquiry-id="${inq.id}" class="form-input change-status-select" style="padding: 0.2rem 0.4rem; font-size: 0.8rem;">
                      <option value="new" ${inq.status === 'new' ? 'selected' : ''}>Mới (new)</option>
                      <option value="contacted" ${inq.status === 'contacted' ? 'selected' : ''}>Đã liên hệ</option>
                      <option value="closed" ${inq.status === 'closed' ? 'selected' : ''}>Hoàn thành / Đóng</option>
                    </select>
                  </td>
                  <td style="padding: 0.75rem; text-align: right;">
                    <span style="color: var(--text-muted); font-size: 0.8rem;">${new Date(
                      inq.created_at
                    ).toLocaleDateString('vi-VN')}</span>
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

  container.querySelectorAll('.change-status-select').forEach((sel) => {
    sel.addEventListener('change', async () => {
      const id = sel.getAttribute('data-inquiry-id');
      const status = sel.value;
      try {
        await adminApi.updateInquiryStatus(id, status);
        alert('Cập nhật trạng thái thành công!');
      } catch (err) {
        alert('Lỗi: ' + (err.response?.data?.message || err.message));
      }
    });
  });

  return () => {};
}

