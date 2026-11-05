export function renderFooter() {
  return `
    <footer class="footer-outcrowd">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="logo">
            <span class="logo-badge">3D</span>
            <span class="logo-text">RealEstate</span>
          </div>
          <p class="footer-desc">
            Nền tảng công nghệ số hóa bất động sản 3D tương tác thế hệ mới. Đem đến trải nghiệm trực quan, chân thực và tối ưu hiệu suất chuyển đổi cho môi giới & chủ đầu tư.
          </p>
        </div>
        <div class="footer-col">
          <h4>Sản Phẩm</h4>
          <ul>
            <li><a href="/properties" data-link>Danh sách dự án</a></li>
            <li><a href="/property/demo-3d" data-link>Mô hình 3D Demo</a></li>
            <li><a href="/property/can-ho-cao-cap-the-metropole-thu-thiem" data-link>The Metropole 3D</a></li>
            <li><a href="#features">Công nghệ WebGL</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Hệ Thống</h4>
          <ul>
            <li><a href="/login" data-link>Đăng nhập Admin</a></li>
            <li><a href="/register" data-link>Tạo tài khoản</a></li>
            <li><a href="https://threejs.org" target="_blank" rel="noreferrer">Three.js Engine</a></li>
            <li><a href="https://laravel.com" target="_blank" rel="noreferrer">Laravel 11 REST API</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom-bar">
        <p>&copy; ${new Date().getFullYear()} RealEstate3D Inc. Thiết kế theo cảm hứng hiện đại từ Outcrowd UI/UX.</p>
        <div style="display: flex; gap: 1.5rem;">
          <a href="#" style="color: var(--text-dim); text-decoration: none;">Điều khoản</a>
          <a href="#" style="color: var(--text-dim); text-decoration: none;">Bảo mật</a>
          <a href="#" style="color: var(--text-dim); text-decoration: none;">Hỗ trợ</a>
        </div>
      </div>
    </footer>
  `;
}
