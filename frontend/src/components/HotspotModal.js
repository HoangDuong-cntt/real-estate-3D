export class HotspotModal {
  constructor() {
    this.modalEl = null;
    this.init();
  }

  init() {
    let el = document.getElementById('hotspot-modal-overlay');
    if (!el) {
      el = document.createElement('div');
      el.id = 'hotspot-modal-overlay';
      el.className = 'hotspot-modal-overlay hidden';
      el.innerHTML = `
        <div class="hotspot-modal-card">
          <button class="modal-close-btn" id="hotspot-modal-close">&times;</button>
          <div class="hotspot-icon-bubble">📍</div>
          <h3 id="hotspot-title" class="hotspot-title"></h3>
          <p id="hotspot-desc" class="hotspot-desc"></p>
        </div>
      `;
      document.body.appendChild(el);

      el.querySelector('#hotspot-modal-close').addEventListener('click', () => this.hide());
      el.addEventListener('click', (e) => {
        if (e.target === el) this.hide();
      });
    }
    this.modalEl = el;
  }

  show(hotspot) {
    if (!this.modalEl) this.init();
    this.modalEl.querySelector('#hotspot-title').textContent = hotspot.label;
    this.modalEl.querySelector('#hotspot-desc').textContent =
      hotspot.content || 'Không có mô tả chi tiết.';
    this.modalEl.classList.remove('hidden');
  }

  hide() {
    if (this.modalEl) {
      this.modalEl.classList.add('hidden');
    }
  }

  dispose() {
    if (this.modalEl && this.modalEl.parentNode) {
      this.modalEl.parentNode.removeChild(this.modalEl);
    }
  }
}

