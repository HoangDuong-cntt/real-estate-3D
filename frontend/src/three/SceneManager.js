import * as THREE from 'three';

export class SceneManager {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.options = {
      antialias: true,
      alpha: true,
      backgroundColor: 0x111827,
      fov: 50,
      near: 0.1,
      far: 1000,
      ...options,
    };

    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.renderCallbacks = [];
    this.isDisposed = false;

    this.initRenderer();
    this.initCamera();
    this.initLights();
    this.initResizeListener();
    this.startRenderLoop();
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: this.options.antialias,
      alpha: this.options.alpha,
      powerPreference: 'high-performance',
    });

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.scene.background = new THREE.Color(this.options.backgroundColor);

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);
  }

  initCamera() {
    const aspect = (this.container.clientWidth || 1) / (this.container.clientHeight || 1);
    this.camera = new THREE.PerspectiveCamera(
      this.options.fov,
      aspect,
      this.options.near,
      this.options.far
    );
    this.camera.position.set(5, 4, 7);
  }

  initLights() {
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    // Main Directional Sun Light
    const dirLight = new THREE.DirectionalLight(0xfff8ee, 1.8);
    dirLight.position.set(15, 25, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 80;
    dirLight.shadow.bias = -0.0005;

    const d = 15;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    this.scene.add(dirLight);

    // Soft Hemisphere Light for realistic sky-ground reflections
    const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x223344, 0.6);
    this.scene.add(hemiLight);

    // Ground Grid Helper for context
    const grid = new THREE.GridHelper(50, 50, 0x3b82f6, 0x1f2937);
    grid.position.y = -0.01;
    this.scene.add(grid);
  }

  initResizeListener() {
    this.onResize = () => {
      if (this.isDisposed || !this.container) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', this.onResize);
  }

  addRenderHook(callback) {
    if (typeof callback === 'function') {
      this.renderCallbacks.push(callback);
    }
  }

  removeRenderHook(callback) {
    this.renderCallbacks = this.renderCallbacks.filter((cb) => cb !== callback);
  }

  startRenderLoop() {
    const animate = () => {
      if (this.isDisposed) return;
      this.animationFrameId = requestAnimationFrame(animate);

      const delta = this.clock.getDelta();
      const elapsedTime = this.clock.getElapsedTime();

      for (let i = 0; i < this.renderCallbacks.length; i++) {
        this.renderCallbacks[i](delta, elapsedTime);
      }

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  dispose() {
    this.isDisposed = true;
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.onResize);

    // Traverse and dispose materials and geometries
    this.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((mat) => mat.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}

