import * as THREE from 'three';

export class HotspotsManager {
  constructor(scene, camera, sceneManager) {
    this.scene = scene;
    this.camera = camera;
    this.sceneManager = sceneManager;

    this.hotspotGroup = new THREE.Group();
    this.scene.add(this.hotspotGroup);

    this.hotspots = [];
    this.onHotspotClick = null;

    // Pulse animation hook
    this.renderHook = (delta, time) => this.animate(time);
    this.sceneManager.addRenderHook(this.renderHook);
  }

  /**
   * Set list of hotspots
   * @param {Array<{id: number, label: string, content: string, x: number, y: number, z: number}>} hotspotsData
   */
  setHotspots(hotspotsData) {
    this.clear();

    hotspotsData.forEach((data) => {
      const pin = this.createHotspotMesh(data);
      this.hotspotGroup.add(pin);
      this.hotspots.push({ data, mesh: pin });
    });
  }

  createHotspotMesh(data) {
    const group = new THREE.Group();
    group.position.set(data.x, data.y, data.z);

    // Inner Glowing Core
    const coreGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      depthTest: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    // Outer Pulsing Ring
    const ringGeo = new THREE.RingGeometry(0.15, 0.22, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.name = 'pulseRing';
    group.add(ringMesh);

    // Tag data for raycasting
    group.userData = {
      isHotspot: true,
      hotspotData: data,
    };
    coreMesh.userData = group.userData;
    ringMesh.userData = group.userData;

    return group;
  }

  animate(time) {
    this.hotspotGroup.children.forEach((group) => {
      // Always face camera (billboard effect)
      group.quaternion.copy(this.camera.quaternion);

      // Pulse ring animation
      const ring = group.getObjectByName('pulseRing');
      if (ring) {
        const scale = 1 + 0.3 * Math.sin(time * 3);
        ring.scale.set(scale, scale, 1);
        ring.material.opacity = 0.5 + 0.3 * Math.cos(time * 3);
      }
    });
  }

  getMeshes() {
    return this.hotspotGroup.children;
  }

  clear() {
    while (this.hotspotGroup.children.length > 0) {
      const obj = this.hotspotGroup.children[0];
      obj.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
      this.hotspotGroup.remove(obj);
    }
    this.hotspots = [];
  }

  dispose() {
    this.sceneManager.removeRenderHook(this.renderHook);
    this.clear();
    this.scene.remove(this.hotspotGroup);
  }
}

