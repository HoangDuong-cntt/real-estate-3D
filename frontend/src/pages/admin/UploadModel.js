import { adminApi } from '../../api/admin';
import { renderNavbar, bindNavbarEvents } from '../../components/Navbar';
import { renderFooter } from '../../components/Footer';

export async function UploadModelPage(container, params, router) {
  const propertyId = params.id;

  container.innerHTML = `
    ${renderNavbar()}
    <main class="page-container">
      <div style="max-width: 750px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <div>
            <h2>Tải Lên Mô Hình 3D (.glb / .gltf)</h2>
            <p class="text-muted">Bất động sản ID: #${propertyId}</p>
          </div>
          <a href="/admin/dashboard" data-link class="btn btn-outline btn-sm">&larr; Quay lại danh sách</a>
        </div>

        <!-- 3D Upload Form -->
        <form id="upload-model-form" class="card" style="padding: 2rem; margin-bottom: 2rem;">
          <h3 style="font-size: 1.1rem; margin-bottom: 1rem;">1. Chọn File 3D</h3>
          
          <div class="form-group">
            <label class="form-label">File Mô hình 3D (.glb hoặc .gltf, tối đa 100MB)</label>
            <input type="file" id="model-file" class="form-input" accept=".glb,.gltf" required />
            <span style="font-size: 0.8rem; color: #94a3b8; display: block; margin-top: 0.3rem;">
              Khuyên dùng file .glb nén Draco từ Blender hoặc SketchUp để tải nhanh nhất trên web.
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Phân loại mô hình</label>
              <select id="model-kind" class="form-input">
                <option value="exterior">Ngoại thất (Exterior)</option>
                <option value="interior">Nội thất (Interior)</option>
                <option value="floorplan">Sơ đồ mặt bằng 3D (Floorplan)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Tỉ lệ Scale</label>
              <input type="number" step="0.1" id="model-scale" class="form-input" value="1.0" />
            </div>
          </div>

          <div id="upload-progress-box" class="hidden" style="margin-bottom: 1rem;">
            <div class="progress-bar-bg" style="width: 100%;">
              <div id="upload-bar-fill" class="progress-bar-fill"></div>
            </div>
          </div>

          <button type="submit" id="submit-upload-btn" class="btn btn-primary" style="width: 100%;">Tải Lên Mô Hình</button>
        </form>

        <!-- Hotspot Configuration Form -->
        <form id="add-hotspot-form" class="card" style="padding: 2rem;">
          <h3 style="font-size: 1.1rem; margin-bottom: 1rem;">2. Thêm Điểm Nhấn Thông Tin (Hotspot 3D)</h3>
          <p class="text-muted" style="font-size: 0.85rem; margin-bottom: 1.25rem;">
            Gắn các điểm chú thích trên mô hình như vị trí phòng ngủ, phòng khách, thiết bị nội thất.
          </p>

          <div class="form-group">
            <label class="form-label">Model ID (sau khi upload xong)</label>
            <input type="number" id="hotspot-model-id" class="form-input" placeholder="ID của model đã tải lên" required />
          </div>

          <div class="form-group">
            <label class="form-label">Tiêu đề Hotspot *</label>
            <input type="text" id="hotspot-label" class="form-input" placeholder="Ví dụ: Đảo bếp cẩm thạch" required />
          </div>

          <div class="form-group">
            <label class="form-label">Nội dung chi tiết</label>
            <textarea id="hotspot-content" class="form-input" rows="2" placeholder="Chi tiết thông số, vật liệu..."></textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Tọa độ X</label>
              <input type="number" step="0.01" id="hotspot-x" class="form-input" value="0" required />
            </div>
            <div class="form-group">
              <label class="form-label">Tọa độ Y</label>
              <input type="number" step="0.01" id="hotspot-y" class="form-input" value="1.5" required />
            </div>
            <div class="form-group">
              <label class="form-label">Tọa độ Z</label>
              <input type="number" step="0.01" id="hotspot-z" class="form-input" value="0" required />
            </div>
          </div>

          <button type="submit" class="btn btn-secondary" style="width: 100%;">Gắn Hotspot</button>
        </form>
      </div>
    </main>
    ${renderFooter()}
  `;

  bindNavbarEvents(router);

  const uploadForm = document.getElementById('upload-model-form');
  uploadForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = document.getElementById('model-file').files[0];
    if (!file) return alert('Vui lòng chọn file .glb!');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('kind', document.getElementById('model-kind').value);
    formData.append('scale', document.getElementById('model-scale').value);

    const progressBox = document.getElementById('upload-progress-box');
    const barFill = document.getElementById('upload-bar-fill');
    const submitBtn = document.getElementById('submit-upload-btn');

    progressBox.classList.remove('hidden');
    submitBtn.disabled = true;

    try {
      const res = await adminApi.uploadModel(propertyId, formData);
      alert('Tải lên mô hình 3D thành công!');
      document.getElementById('hotspot-model-id').value = res.data.model.id;
    } catch (err) {
      alert('Lỗi tải file: ' + (err.response?.data?.message || err.message));
    } finally {
      submitBtn.disabled = false;
      progressBox.classList.add('hidden');
    }
  });

  const hotspotForm = document.getElementById('add-hotspot-form');
  hotspotForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const modelId = document.getElementById('hotspot-model-id').value;
    const data = {
      label: document.getElementById('hotspot-label').value,
      content: document.getElementById('hotspot-content').value,
      x: document.getElementById('hotspot-x').value,
      y: document.getElementById('hotspot-y').value,
      z: document.getElementById('hotspot-z').value,
    };

    try {
      await adminApi.addHotspot(modelId, data);
      alert('Đã thêm Hotspot thành công!');
      hotspotForm.reset();
      document.getElementById('hotspot-model-id').value = modelId;
    } catch (err) {
      alert('Lỗi thêm hotspot: ' + (err.response?.data?.message || err.message));
    }
  });

  return () => {};
}

