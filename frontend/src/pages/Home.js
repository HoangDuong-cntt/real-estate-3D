import { propertyApi } from '../api/properties';
import { renderNavbar, bindNavbarEvents } from '../components/Navbar';
import { renderFooter } from '../components/Footer';

export async function HomePage(container, params, router) {
  let properties = [];
  try {
    const res = await propertyApi.getProperties({ per_page: 6 });
    properties = res.data.data || [];
  } catch (err) {
    console.error('Lỗi tải danh sách BĐS:', err);
  }

  container.innerHTML = `
    ${renderNavbar()}
    <main class="page-content">
      <!-- Outcrowd Hero Section -->
      <section class="hero-outcrowd">
        <div class="pill-badge">
          <span class="pill-dot"></span>
          <span>Next-Gen 3D Real Estate Platform • Trực quan hóa số 1 Việt Nam</span>
        </div>

        <h1 class="hero-title">
          Nâng Tầm Không Gian Sống Với<br/>
          <span class="gradient-text-outcrowd">Trải Nghiệm 3D Thực Tế Ảo</span>
        </h1>

        <p class="hero-subtitle">
          Khám phá trọn vẹn kiến trúc căn hộ, biệt thự cao cấp với mô hình tương tác 3D WebGL. Tự do xoay 360 độ hoặc bước vào chế độ đi bộ góc nhìn thứ nhất (Walkthrough) chỉ với một cú nhấp chuột.
        </p>

        <div class="hero-actions">
          <a href="/properties" data-link class="btn btn-primary">Khám Phá Tất Cả Dự Án</a>
          <a href="/property/can-ho-cao-cap-the-metropole-thu-thiem" data-link class="btn btn-secondary flying-button">
            <span class="flying-button-smoke" aria-hidden="true"></span>
            <span class="flying-button-thrusters" aria-hidden="true"></span>
            <span class="flying-button-label">🚀 Xem Demo 3D Tour</span>
          </a>
        </div>

        <!-- Social Proof Trust Bar -->
        <div class="social-proof-bar">
          <div class="avatar-stack">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop" alt="User 1" />
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop" alt="User 2" />
            <img src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop" alt="User 3" />
            <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop" alt="User 4" />
          </div>
          <div class="proof-text">
            <span class="proof-stars">★★★★★</span>
            <span><strong>4.9/5</strong> từ hơn 1,500+ khách hàng & nhà đầu tư</span>
          </div>
        </div>

        <!-- Interactive Hero 3D Showcase Card -->
        <div class="hero-showcase-card">
          <!-- Floating Badge Top Left -->
          <div class="floating-stat-badge pos-top-left">
            <div class="badge-icon">📍</div>
            <div class="badge-info">
              <h4>Hotspots Tương Tác</h4>
              <p>Chạm xem chi tiết nội thất</p>
            </div>
          </div>

          <!-- Floating Badge Bottom Right -->
          <div class="floating-stat-badge pos-bottom-right">
            <div class="badge-icon">⚡</div>
            <div class="badge-info">
              <h4>WebGL & Draco 3D</h4>
              <p>Mượt mà trên mọi thiết bị</p>
            </div>
          </div>

          <!-- Preview Frame -->
          <div class="showcase-preview-frame">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80"
              class="showcase-preview-img"
              alt="Mô hình biệt thự 3D"
            />
            <div class="showcase-overlay-gradient"></div>

            <div class="showcase-cta-center">
              <a href="/property/can-ho-cao-cap-the-metropole-thu-thiem" data-link class="pulse-play-btn" title="Vào trải nghiệm 3D ngay">
                ▶
              </a>
              <span style="font-weight: 700; font-size: 1.1rem; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.8);">
                Bấm để bước vào căn hộ 3D The Metropole
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Key Numbers / Metrics Section -->
      <section class="stats-banner">
        <div class="stat-item">
          <h3>250+</h3>
          <p>Mô hình 3D đã số hóa</p>
        </div>
        <div class="stat-item">
          <h3>50,000+</h3>
          <p>Lượt tham quan thực tế ảo</p>
        </div>
        <div class="stat-item">
          <h3>70%</h3>
          <p>Tiết kiệm thời gian khảo sát</p>
        </div>
        <div class="stat-item">
          <h3>3.2x</h3>
          <p>Tăng tỷ lệ chốt giao dịch</p>
        </div>
      </section>

      <!-- Bento Grid Features (Outcrowd Signature) -->
      <section id="features" class="section-outcrowd">
        <div class="section-head">
          <div class="pill-badge" style="margin-bottom: 0.8rem;">
            <span>✨ Tính Năng Đột Phá</span>
          </div>
          <h2>Công Nghệ Trực Quan Đỉnh Cao</h2>
          <p>Trải nghiệm công nghệ 3D tân tiến nhất giúp bạn xem nhà ngay tại phòng khách mà không cần di chuyển.</p>
        </div>

        <div class="bento-grid">
          <div class="bento-card bento-col-2">
            <div class="bento-icon-wrapper" style="background: rgba(99, 102, 241, 0.2); color: #818cf8;">
              🌐
            </div>
            <h3>Mô Hình Toàn Cảnh 360° & Nén Draco Siêu Nhẹ</h3>
            <p>
              Hệ thống tối ưu hóa tệp tin GLTF/GLB với thuật toán Google Draco nén dữ liệu đến 80%. Tải nhanh tức thì ngay cả trên mạng 4G, mang lại trải nghiệm xoay quanh tòa nhà mượt mà 60 FPS.
            </p>
          </div>

          <div class="bento-card">
            <div class="bento-icon-wrapper" style="background: rgba(236, 72, 153, 0.2); color: #f472b6;">
              🚶
            </div>
            <h3>Đi Bộ Tự Do (First-Person Walk)</h3>
            <p>
              Chuyển chế độ và điều khiển bằng phím W-A-S-D kèm chuột để bước vào từng góc phòng, cảm nhận trọn vẹn chiều cao trần và diện tích thực tế.
            </p>
          </div>

          <div class="bento-card">
            <div class="bento-icon-wrapper" style="background: rgba(6, 182, 212, 0.2); color: #22d3ee;">
              📍
            </div>
            <h3>Hotspots Tương Tác Thông Minh</h3>
            <p>
              Các điểm ghim 3D với hiệu ứng sóng phát sáng gắn trực tiếp trên mô hình: thiết bị bếp, ban công, view sông, chạm vào để hiển thị thông số kỹ thuật.
            </p>
          </div>

          <div class="bento-card bento-col-2">
            <div class="bento-icon-wrapper" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">
              ⚡
            </div>
            <h3>Quản Trị Bất Động Sản & Đặt Lịch Xem Trực Tuyến</h3>
            <p>
              Dành riêng cho môi giới và chủ đầu tư: dễ dàng upload mô hình 3D, thiết lập vị trí camera mặc định, đồng thời nhận thông tin yêu cầu đặt lịch hẹn từ khách hàng theo thời gian thực.
            </p>
          </div>
        </div>
      </section>

      <!-- Featured 3D Listings Showcase -->
      <section class="section-outcrowd">
        <div class="section-head" style="display: flex; justify-content: space-between; align-items: flex-end; text-align: left; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="pill-badge" style="margin-bottom: 0.8rem;">
              <span>🏡 Dự Án Nổi Bật</span>
            </div>
            <h2>Bất Động Sản Nổi Bật</h2>
            <p>Khám phá các dự án bất động sản tiêu biểu và thông tin hiện có</p>
          </div>
          <a href="/properties" data-link class="btn btn-outline btn-sm">Xem tất cả dự án &rarr;</a>
        </div>

        <div class="grid-cards">
          ${
            properties.length === 0
              ? `
              <div class="bento-card" style="padding: 3rem; grid-column: 1 / -1; text-align: center;">
                <p>Chưa có bất động sản nào từ API backend.</p>
                <div style="margin-top: 1rem;">
                  <a href="/property/demo-3d" data-link class="btn btn-primary btn-sm">Xem Demo Căn Hộ 3D Mẫu</a>
                </div>
              </div>
            `
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
                        p.bedrooms > 0 && `<span class="spec-pill">🛏️ ${p.bedrooms} Phòng ngủ</span>`,
                        p.bathrooms > 0 && `<span class="spec-pill">🚿 ${p.bathrooms} WC</span>`,
                      ]
                        .filter(Boolean)
                        .join('') || '<span class="spec-pill">Thông số căn hộ đang cập nhật</span>'
                    }
                  </div>
                  <div class="card-address-row">
                    📍 ${p.address}, ${p.city}
                  </div>
                  <div style="margin-top: auto; padding-top: 1rem;">
                    <a href="/property/${p.slug}" data-link class="btn btn-primary btn-sm" style="width: 100%;">
                      ${has3dModel ? 'Bước vào trải nghiệm 3D' : 'Xem thông tin dự án'}
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
      </section>

      <!-- Conversion Call To Action Banner -->
      <section class="section-outcrowd">
        <div class="cta-banner-outcrowd">
          <h2>Sẵn Sàng Trải Nghiệm Bất Động Sản Trong Kỷ Nguyên Mới?</h2>
          <p>
            Đăng ký miễn phí hoặc liên hệ với chúng tôi để số hóa không gian dự án của bạn thành mô hình 3D tương tác sống động.
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="/register" data-link class="btn btn-primary">Tạo Tài Khoản Khách Hàng</a>
            <a href="/property/can-ho-cao-cap-the-metropole-thu-thiem" data-link class="btn btn-secondary">
              Xem Dự Án Mẫu Ngay
            </a>
          </div>
        </div>
      </section>
    </main>
    ${renderFooter()}
  `;

  bindNavbarEvents(router);

  return () => {};
}
