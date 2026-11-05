import { propertyApi } from '../api/properties';
import { renderNavbar, bindNavbarEvents } from '../components/Navbar';
import { renderFooter } from '../components/Footer';

export async function PropertyListPage(container, params, router) {
  let properties = [];
  let types = [];

  try {
    const [propRes, typesRes] = await Promise.all([
      propertyApi.getProperties({ per_page: 20 }),
      propertyApi.getTypes(),
    ]);
    properties = propRes.data.data || [];
    types = typesRes.data || [];
  } catch (err) {
    console.error('Lỗi tải dữ liệu:', err);
  }

  container.innerHTML = `
    ${renderNavbar()}
    <main class="page-container">
      <div style="margin-bottom: 2.5rem; text-align: center;">
        <div class="pill-badge">
          <span>Khám Phá Toàn Diện</span>
        </div>
        <h1 style="font-family: var(--font-heading); font-size: 2.8rem; font-weight: 800; margin-bottom: 0.8rem;">
          Danh Sách Bất Động Sản 3D
        </h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; max-width: 600px; margin: 0 auto;">
          Lọc theo vị trí, loại hình và mức giá để tìm không gian sống lý tưởng nhất
        </p>
      </div>

      <div class="filters-bar" style="display: flex; gap: 1rem; margin-bottom: 3rem; justify-content: center; flex-wrap: wrap;">
        <input type="text" id="filter-search" class="form-input" style="max-width: 320px;" placeholder="Tìm theo tên, địa chỉ..." />
        <select id="filter-type" class="form-input" style="max-width: 220px;">
          <option value="">Tất cả loại hình BĐS</option>
          ${types.map((t) => `<option value="${t.id}">${t.name}</option>`).join('')}
        </select>
        <button id="filter-btn" class="btn btn-primary btn-sm" style="padding: 0.6rem 1.6rem;">Lọc Dự Án</button>
      </div>

      <div class="grid-cards" id="property-list-grid">
        ${
          properties.length === 0
            ? `<div class="bento-card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">Chưa có bất động sản nào phù hợp.</div>`
            : properties
                .map(
                (p) => {
                  const has3dModel = p.models?.some((model) => model.file_url);
                  return `
            <div class="card-property-outcrowd">
            <div class="card-img-wrap">
              ${
                p.images?.[0]?.url
                  ? `<img src="${p.images[0].url}" alt="${p.title}" />`
                  : `<div class="property-image-placeholder"><span>🏙️</span><small>Ảnh dự án đang cập nhật</small></div>`
              }
              ${
                has3dModel
                  ? '<span class="badge-3d-glow">🎮 3D Tour</span>'
                  : '<span class="badge-project-info">Thông tin dự án</span>'
              }
            </div>
            <div class="card-body">
              <h3 class="card-title">${p.title}</h3>
              <div class="card-price-tag">${p.price ? `${(p.price / 1000000000).toFixed(2)} tỷ VNĐ` : 'Giá bán: Chưa công bố'}</div>
              <div class="card-specs-pills">
                ${
                  [
                    p.area_m2 && `<span class="spec-pill">📐 ${p.area_m2} m²</span>`,
                    p.bedrooms > 0 && `<span class="spec-pill">🛏️ ${p.bedrooms} PN</span>`,
                    p.bathrooms > 0 && `<span class="spec-pill">🚿 ${p.bathrooms} WC</span>`,
                  ]
                    .filter(Boolean)
                    .join('') || '<span class="spec-pill">Thông số căn hộ đang cập nhật</span>'
                }
              </div>
                <div class="card-address-row">📍 ${p.address}, ${p.city}</div>
                <div style="margin-top: auto; padding-top: 1rem;">
                  <a href="/property/${p.slug}" data-link class="btn btn-primary btn-sm" style="width: 100%;">
                    ${has3dModel ? 'Trải nghiệm 3D' : 'Xem thông tin dự án'}
                  </a>
                </div>
              </div>
            </div>
          `;
                  }
                )
                .join('')
        }
      </div>
    </main>
    ${renderFooter()}
  `;

  bindNavbarEvents(router);

  return () => {};
}
