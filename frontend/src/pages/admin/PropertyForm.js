import { adminApi } from '../../api/admin';
import { propertyApi } from '../../api/properties';
import { renderNavbar, bindNavbarEvents } from '../../components/Navbar';
import { renderFooter } from '../../components/Footer';

export async function PropertyFormPage(container, params, router) {
  let types = [];
  try {
    const res = await propertyApi.getTypes();
    types = res.data || [];
  } catch (err) {
    console.error(err);
  }

  container.innerHTML = `
    ${renderNavbar()}
    <main class="page-container">
      <div style="max-width: 700px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h2>Thêm Bất Động Sản Mới</h2>
          <a href="/admin/dashboard" data-link class="btn btn-outline btn-sm">&larr; Quay lại</a>
        </div>

        <form id="create-property-form" class="card" style="padding: 2rem;">
          <div class="form-group">
            <label class="form-label">Tiêu đề BĐS *</label>
            <input type="text" id="title" class="form-input" placeholder="Ví dụ: Căn hộ Masteri Centre Point 2PN" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Loại Bất Động Sản *</label>
              <select id="type_id" class="form-input" required>
                ${types.map((t) => `<option value="${t.id}">${t.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Giá bán (VNĐ)</label>
              <input type="number" id="price" class="form-input" placeholder="Chưa có thông tin" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Diện tích (m²)</label>
              <input type="number" step="0.1" id="area_m2" class="form-input" placeholder="Chưa có thông tin" />
            </div>
            <div class="form-group">
              <label class="form-label">Phòng ngủ</label>
              <input type="number" id="bedrooms" class="form-input" value="2" />
            </div>
            <div class="form-group">
              <label class="form-label">Phòng tắm</label>
              <input type="number" id="bathrooms" class="form-input" value="2" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Địa chỉ *</label>
            <input type="text" id="address" class="form-input" placeholder="Số nhà, đường phố" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Tỉnh / Thành phố *</label>
              <input type="text" id="city" class="form-input" value="TP. Hồ Chí Minh" required />
            </div>
            <div class="form-group">
              <label class="form-label">Quận / Huyện</label>
              <input type="text" id="district" class="form-input" placeholder="Quận 1, Thủ Đức..." />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Mô tả chi tiết</label>
            <textarea id="description" class="form-input" rows="4" placeholder="Mô tả tiện ích, hướng nhà, pháp lý..."></textarea>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Lưu và Tiếp tục</button>
        </form>
      </div>
    </main>
    ${renderFooter()}
  `;

  bindNavbarEvents(router);

  const form = document.getElementById('create-property-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      title: document.getElementById('title').value,
      type_id: document.getElementById('type_id').value,
      price: document.getElementById('price').value || null,
      area_m2: document.getElementById('area_m2').value || null,
      bedrooms: document.getElementById('bedrooms').value || 0,
      bathrooms: document.getElementById('bathrooms').value || 0,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      district: document.getElementById('district').value,
      description: document.getElementById('description').value,
      status: 'published',
    };

    try {
      const res = await adminApi.createProperty(data);
      alert('Tạo bất động sản thành công! Bây giờ bạn có thể upload mô hình 3D.');
      router.navigate(`/admin/properties/${res.data.property.id}/upload-model`);
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  });

  return () => {};
}
