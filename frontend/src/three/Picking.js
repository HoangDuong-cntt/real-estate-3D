import * as THREE from 'three';

export class PickingManager {
  constructor(camera, domElement, options = {}) {
    this.camera = camera;
    this.domElement = domElement;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.interactiveObjects = [];
    this.onSelect = options.onSelect || null;
    this.onHover = options.onHover || null;
    this.onHotspotClick = options.onHotspotClick || null;

    this.hoveredObject = null;

    this.initEvents();
  }

  setInteractiveObjects(objects) {
    this.interactiveObjects = objects;
  }

  addInteractiveObject(object) {
    this.interactiveObjects.push(object);
  }

  initEvents() {
    this.onPointerMove = (event) => {
      const rect = this.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.checkHover();
    };

    this.onClick = (event) => {
      const rect = this.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

      if (intersects.length > 0) {
        const hit = intersects[0];
        let current = hit.object;

        // Traverse up to find userData
        while (current && !current.userData?.isHotspot && current.parent) {
          current = current.parent;
        }

        if (current?.userData?.isHotspot && this.onHotspotClick) {
          this.onHotspotClick(current.userData.hotspotData);
          return;
        }

        if (this.onSelect) {
          this.onSelect(hit);
        }
      }
    };

    this.domElement.addEventListener('mousemove', this.onPointerMove);
    this.domElement.addEventListener('click', this.onClick);
  }

  checkHover() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    if (intersects.length > 0) {
      this.domElement.style.cursor = 'pointer';
      const hit = intersects[0];

      if (this.hoveredObject !== hit.object) {
        this.hoveredObject = hit.object;
        if (this.onHover) this.onHover(hit);
      }
    } else {
      this.domElement.style.cursor = 'default';
      if (this.hoveredObject !== null) {
        this.hoveredObject = null;
        if (this.onHover) this.onHover(null);
      }
    }
  }

  dispose() {
    this.domElement.removeEventListener('mousemove', this.onPointerMove);
    this.domElement.removeEventListener('click', this.onClick);
  }
}

