import * as THREE from 'three';
import { propertyApi } from '../api/properties';
import { inquiryApi } from '../api/inquiries';
import { SceneManager } from '../three/SceneManager';
import { ModelLoader } from '../three/ModelLoader';
import { ControlsManager } from '../three/Controls';
import { HotspotsManager } from '../three/Hotspots';
import { PickingManager } from '../three/Picking';
import { HotspotModal } from '../components/HotspotModal';
import { renderWalkthroughHelp } from '../components/WalkthroughHelp';
import { renderNavbar, bindNavbarEvents } from '../components/Navbar';
import { renderFooter } from '../components/Footer';

export async function PropertyDetail3DPage(container, params, router) {
  const slug = params.slug || 'demo-3d';
  let property = null;

  try {
    if (slug !== 'demo-3d') {
      const res = await propertyApi.getPropertyBySlug(slug);
      property = res.data;
    }
  } catch (err) {
    console.warn('Không tìm thấy BĐS từ API, chuyển sang chế độ Demo 3D', err);
  }

  // Fallback demo object if property is null
  if (!property) {
    property = {
      title: 'Mô hình Căn Hộ Hiện Đại 3D (Demo)',
      price: 8500000000,
      area_m2: 95.0,
      bedrooms: 2,
      bathrooms: 2,
      address: '123 Đường Công Nghệ, Khu Đô Thị Mới',
      city: 'TP. Hồ Chí Minh',
      description: 'Mô hình 3D tương tác kiến trúc hiện đại, hỗ trợ xoay 360 độ, kiểm tra các điểm thông tin và chế độ đi bộ.',
      models: [
        {
          file_url: null, // Will use procedural 3D model generator
          kind: 'interior',
          hotspots: [
            { id: 1, label: 'Phòng khách thông minh', content: 'Khu vực đón tiếp với hệ thống đèn thông minh và ban công mở.', x: 0, y: 1.5, z: 2 },
            { id: 2, label: 'Khu vực bếp sang trọng', content: 'Thiết bị bếp cao cấp tiêu chuẩn châu Âu.', x: -2.5, y: 1.2, z: -1 },
          ],
        },
      ],
    };
  }

  if (property.id && !property.models?.length) {
    container.innerHTML = `
      ${renderNavbar()}
      <main class="page-container project-overview">
        <a href="/properties" data-link class="btn btn-outline btn-sm project-back-link">← Tất cả dự án</a>
        <section class="project-overview-card">
          <div class="project-overview-visual">
            ${
              property.images?.[0]?.url
                ? `<img class="project-overview-image" src="${property.images[0].url}" alt="${property.title}" />`
                : `<div class="property-image-placeholder project-image-placeholder"><span>🏙️</span><small>Hình ảnh dự án đang cập nhật</small></div>`
            }
          </div>
          <div class="project-overview-content">
            <span class="pill-badge">Thông tin dự án</span>
            <h1>${property.title}</h1>
            <p class="project-overview-address">📍 ${property.address}, ${property.city}</p>
            <p class="project-overview-description">${property.description || 'Thông tin chi tiết dự án đang được cập nhật.'}</p>
            <div class="project-overview-facts">
              <div><span>Giá bán</span><strong>${property.price ? `${(property.price / 1000000000).toFixed(2)} tỷ VNĐ` : 'Chưa công bố'}</strong></div>
              <div><span>Diện tích</span><strong>${property.area_m2 ? `${property.area_m2} m²` : 'Đang cập nhật'}</strong></div>
            </div>
            <p class="project-overview-note">Thông tin căn hộ, giá và hình ảnh cần được xác nhận với đơn vị phát triển dự án.</p>
            <form id="inquiry-form" class="project-inquiry-form">
              <label for="inquiry-message">Quan tâm dự án này?</label>
              <textarea id="inquiry-message" class="form-input" rows="3" placeholder="Nhập câu hỏi hoặc thông tin cần tư vấn..."></textarea>
              <button type="submit" class="btn btn-primary">Gửi yêu cầu tư vấn</button>
            </form>
          </div>
        </section>
      </main>
      ${renderFooter()}
    `;

    bindNavbarEvents(router);
    bindInquiryForm(property, router);
    return () => {};
  }

  container.innerHTML = `
    ${renderNavbar()}
    <div class="viewer-wrapper">
      <div id="three-canvas-container"></div>

      <!-- Loading Indicator -->
      <div id="model-loader-overlay" class="loading-overlay">
        <h3>Đang tải mô hình 3D...</h3>
        <div class="progress-bar-bg">
          <div id="model-progress-fill" class="progress-bar-fill"></div>
        </div>
      </div>

      <!-- Control Toolbar -->
      <div class="viewer-toolbar">
        <button id="btn-mode-orbit" class="btn btn-primary btn-sm">🔄 Xoay 360°</button>
        <button id="btn-mode-walk" class="btn btn-outline btn-sm">🚶 Đi bộ trong nhà</button>
        <button id="btn-reset-view" class="btn btn-outline btn-sm">🎯 Góc nhìn chuẩn</button>
      </div>

      ${renderWalkthroughHelp()}

      <!-- Property Details Sidebar -->
      <div class="viewer-sidebar">
        <h2 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${property.title}</h2>
        <div style="font-size: 1.4rem; font-weight: 700; color: #38bdf8; margin-bottom: 0.75rem;">
          ${(property.price / 1000000000).toFixed(2)} tỷ VNĐ
        </div>
        <div style="display: flex; gap: 0.75rem; font-size: 0.85rem; color: #94a3b8; margin-bottom: 1rem;">
          <span>📐 ${property.area_m2} m²</span>
          <span>🛏️ ${property.bedrooms} PN</span>
          <span>🚿 ${property.bathrooms} WC</span>
        </div>
        <p style="font-size: 0.85rem; color: #cbd5e1; line-height: 1.5; margin-bottom: 1.25rem;">
          ${property.description || ''}
        </p>

        <hr style="border-color: #334155; margin-bottom: 1.25rem;" />

        <h3 style="font-size: 1rem; margin-bottom: 0.75rem;">Đặt lịch xem / Tư vấn</h3>
        <form id="inquiry-form">
          <div class="form-group">
            <textarea id="inquiry-message" class="form-input" rows="3" placeholder="Nhập câu hỏi hoặc thời gian bạn muốn xem nhà..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-sm" style="width: 100%;">Gửi yêu cầu</button>
        </form>
      </div>
    </div>
  `;

  bindNavbarEvents(router);

  const canvasContainer = document.getElementById('three-canvas-container');
  const loaderOverlay = document.getElementById('model-loader-overlay');
  const progressFill = document.getElementById('model-progress-fill');
  const walkHelp = document.getElementById('walkthrough-help');
  if (walkHelp) walkHelp.classList.add('hidden');

  // Initialize Three.js Scene
  const sceneManager = new SceneManager(canvasContainer);
  const controlsManager = new ControlsManager(
    sceneManager.camera,
    sceneManager.renderer.domElement,
    sceneManager
  );
  const hotspotsManager = new HotspotsManager(
    sceneManager.scene,
    sceneManager.camera,
    sceneManager
  );
  const hotspotModal = new HotspotModal();

  const pickingManager = new PickingManager(sceneManager.camera, sceneManager.renderer.domElement, {
    onHotspotClick: (data) => {
      hotspotModal.show(data);
    },
  });

  const modelLoader = new ModelLoader('/draco/');
  const activeModelData = property.models?.[0];

  // Load Model or Build Procedural Architectural Prototype
  if (activeModelData?.file_url) {
    try {
      const model = await modelLoader.load(activeModelData.file_url, (percent) => {
        if (progressFill) progressFill.style.width = `${percent}%`;
      });

      if (activeModelData.scale) model.scale.setScalar(activeModelData.scale);
      sceneManager.scene.add(model);
      pickingManager.addInteractiveObject(model);

      if (activeModelData.camera_json?.position) {
        controlsManager.setCameraPosition(
          activeModelData.camera_json.position,
          activeModelData.camera_json.target || [0, 0, 0]
        );
      }
    } catch (err) {
      console.error('Không thể tải file model 3D, dựng mô hình demo:', err);
      createProceduralApartment(sceneManager.scene, pickingManager);
    }
  } else {
    // Build clean procedural 3D model
    createProceduralApartment(sceneManager.scene, pickingManager);
  }

  // Load Hotspots
  const hotspots = activeModelData?.hotspots || [];
  hotspotsManager.setHotspots(hotspots);
  pickingManager.setInteractiveObjects([
    ...pickingManager.interactiveObjects,
    ...hotspotsManager.getMeshes(),
  ]);

  if (loaderOverlay) loaderOverlay.classList.add('hidden');

  // Mode Switchers
  const btnOrbit = document.getElementById('btn-mode-orbit');
  const btnWalk = document.getElementById('btn-mode-walk');
  const btnReset = document.getElementById('btn-reset-view');

  btnOrbit?.addEventListener('click', () => {
    controlsManager.setMode('orbit');
    btnOrbit.className = 'btn btn-primary btn-sm';
    btnWalk.className = 'btn btn-outline btn-sm';
    if (walkHelp) walkHelp.classList.add('hidden');
  });

  btnWalk?.addEventListener('click', () => {
    controlsManager.setMode('walk');
    btnWalk.className = 'btn btn-primary btn-sm';
    btnOrbit.className = 'btn btn-outline btn-sm';
    if (walkHelp) walkHelp.classList.remove('hidden');
  });

  btnReset?.addEventListener('click', () => {
    controlsManager.setCameraPosition([5, 4, 7], [0, 1, 0]);
  });

  // Inquiry form submit
  bindInquiryForm(property, router);

  // Cleanup on page unmount
  return () => {
    hotspotModal.dispose();
    pickingManager.dispose();
    hotspotsManager.dispose();
    controlsManager.dispose();
    modelLoader.dispose();
    sceneManager.dispose();
  };
}

function bindInquiryForm(property, router) {
  const inquiryForm = document.getElementById('inquiry-form');
  inquiryForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('inquiry-message')?.value;
    if (!msg) return alert('Vui lòng nhập lời nhắn!');
    try {
      await inquiryApi.createInquiry({
        property_id: property.id || 1,
        message: msg,
      });
      alert('Đã gửi thông tin yêu cầu thành công!');
      inquiryForm.reset();
    } catch (err) {
      alert('Vui lòng đăng nhập để gửi yêu cầu đặt lịch xem!');
      router.navigate('/login');
    }
  });
}

/**
 * Creates an elegant procedural modern apartment model for instant 3D testing
 */
function createProceduralApartment(scene, pickingManager) {
  const root = new THREE.Group();

  // Floor
  const floorGeo = new THREE.BoxGeometry(10, 0.2, 8);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.3,
    metalness: 0.1,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = -0.1;
  floor.receiveShadow = true;
  root.add(floor);

  // Walls
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.8,
  });

  // Back wall
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(10, 3, 0.2), wallMat);
  backWall.position.set(0, 1.5, -4);
  backWall.castShadow = true;
  backWall.receiveShadow = true;
  root.add(backWall);

  // Left wall
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 8), wallMat);
  leftWall.position.set(-5, 1.5, 0);
  leftWall.castShadow = true;
  leftWall.receiveShadow = true;
  root.add(leftWall);

  // Modern Sofa
  const sofaMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5 });
  const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 1.0), sofaMat);
  sofaBase.position.set(0, 0.2, 1);
  sofaBase.castShadow = true;
  root.add(sofaBase);

  const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 0.3), sofaMat);
  sofaBack.position.set(0, 0.6, 1.4);
  sofaBack.castShadow = true;
  root.add(sofaBack);

  // Coffee Table
  const tableMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.2 });
  const table = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.3, 32), tableMat);
  table.position.set(0, 0.15, -0.2);
  table.castShadow = true;
  root.add(table);

  // Television Display Unit
  const tvMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 });
  const tvScreen = new THREE.Mesh(new THREE.BoxGeometry(3, 1.6, 0.05), tvMat);
  tvScreen.position.set(0, 1.6, -3.85);
  root.add(tvScreen);

  scene.add(root);
  pickingManager.addInteractiveObject(root);
}
