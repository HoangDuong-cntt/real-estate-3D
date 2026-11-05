import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class ControlsManager {
  constructor(camera, domElement, sceneManager) {
    this.camera = camera;
    this.domElement = domElement;
    this.sceneManager = sceneManager;

    this.mode = 'orbit'; // 'orbit' | 'walk'
    this.orbitControls = null;

    // Walkthrough state
    this.moveState = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };
    this.walkSpeed = 5.0; // units/sec
    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.isPointerLocked = false;

    this.initOrbitControls();
    this.initWalkControls();

    // Register render loop hook
    this.updateHook = (delta) => this.update(delta);
    this.sceneManager.addRenderHook(this.updateHook);
  }

  initOrbitControls() {
    this.orbitControls = new OrbitControls(this.camera, this.domElement);
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.05;
    this.orbitControls.maxPolarAngle = Math.PI / 2 - 0.01; // Don't go below ground
    this.orbitControls.minDistance = 1;
    this.orbitControls.maxDistance = 100;
  }

  initWalkControls() {
    this.onKeyDown = (e) => {
      if (this.mode !== 'walk') return;
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.moveState.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.moveState.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.moveState.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.moveState.right = true;
          break;
      }
    };

    this.onKeyUp = (e) => {
      if (this.mode !== 'walk') return;
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.moveState.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.moveState.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.moveState.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.moveState.right = false;
          break;
      }
    };

    this.onMouseMove = (e) => {
      if (this.mode !== 'walk' || !this.isPointerLocked) return;

      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;

      this.euler.setFromQuaternion(this.camera.quaternion);
      this.euler.y -= movementX * 0.002;
      this.euler.x -= movementY * 0.002;

      // Limit vertical pitch
      this.euler.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this.euler.x));
      this.camera.quaternion.setFromEuler(this.euler);
    };

    this.onPointerLockChange = () => {
      this.isPointerLocked = document.pointerLockElement === this.domElement;
    };

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('pointerlockchange', this.onPointerLockChange);
  }

  setMode(mode) {
    this.mode = mode;

    if (mode === 'orbit') {
      if (document.pointerLockElement === this.domElement) {
        document.exitPointerLock();
      }
      this.orbitControls.enabled = true;
    } else if (mode === 'walk') {
      this.orbitControls.enabled = false;
      // Set typical eye level
      this.camera.position.y = 1.7;
      this.domElement.requestPointerLock?.();
    }
  }

  setCameraPosition(position, target = [0, 0, 0]) {
    if (Array.isArray(position)) {
      this.camera.position.set(...position);
    }
    if (this.orbitControls && Array.isArray(target)) {
      this.orbitControls.target.set(...target);
      this.orbitControls.update();
    }
  }

  update(delta) {
    if (this.mode === 'orbit') {
      this.orbitControls.update();
    } else if (this.mode === 'walk') {
      const moveDistance = this.walkSpeed * delta;
      const direction = new THREE.Vector3();

      if (this.moveState.forward) direction.z -= 1;
      if (this.moveState.backward) direction.z += 1;
      if (this.moveState.left) direction.x -= 1;
      if (this.moveState.right) direction.x += 1;

      direction.normalize();

      // Transform direction based on horizontal camera angle
      const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.euler.y);
      const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.euler.y);

      if (this.moveState.forward) this.camera.position.addScaledVector(forward, moveDistance);
      if (this.moveState.backward) this.camera.position.addScaledVector(forward, -moveDistance);
      if (this.moveState.right) this.camera.position.addScaledVector(right, moveDistance);
      if (this.moveState.left) this.camera.position.addScaledVector(right, -moveDistance);

      // Keep fixed eye level
      this.camera.position.y = 1.7;
    }
  }

  dispose() {
    this.sceneManager.removeRenderHook(this.updateHook);
    if (this.orbitControls) this.orbitControls.dispose();
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
  }
}

