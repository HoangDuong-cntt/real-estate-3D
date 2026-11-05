import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export class ModelLoader {
  constructor(dracoPath = '/draco/') {
    this.loader = new GLTFLoader();

    // Configure Draco decoder for compressed models
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath(dracoPath);
    this.loader.setDRACOLoader(this.dracoLoader);
  }

  /**
   * Load a GLTF/GLB model from URL
   * @param {string} url Model URL
   * @param {Function} onProgress Progress callback
   * @returns {Promise<THREE.Group>}
   */
  load(url, onProgress = null) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          const model = gltf.scene;

          // Enable shadows and optimize materials
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) {
                child.material.side = THREE.DoubleSide;
              }
            }
          });

          resolve(model);
        },
        (xhr) => {
          if (xhr.lengthComputable && onProgress) {
            const percent = Math.round((xhr.loaded / xhr.total) * 100);
            onProgress(percent);
          }
        },
        (error) => {
          console.error('Error loading 3D model:', error);
          reject(error);
        }
      );
    });
  }

  /**
   * Fit model inside a bounding box and center it
   */
  fitToBox(model, maxDimension = 10) {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Center model at origin (y on ground)
    model.position.x += -center.x;
    model.position.y += -box.min.y;
    model.position.z += -center.z;

    // Scale down if larger than maxDimension
    const maxAxis = Math.max(size.x, size.y, size.z);
    if (maxAxis > 0) {
      const scale = maxDimension / maxAxis;
      model.scale.setScalar(scale);
    }

    return model;
  }

  dispose() {
    if (this.dracoLoader) {
      this.dracoLoader.dispose();
    }
  }
}

