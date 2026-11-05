import { authStore } from '../store/auth';

class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentCleanUp = null;

    window.addEventListener('popstate', () => this.handleRoute());
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a[data-link]');
      if (target) {
        e.preventDefault();
        this.navigate(target.getAttribute('href'));
      }
    });
  }

  navigate(url) {
    window.history.pushState(null, null, url);
    this.handleRoute();
  }

  match(pathname) {
    for (const route of this.routes) {
      // Dynamic route regex support e.g. /property/:slug
      const keys = [];
      const patternStr = route.path
        .replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
          keys.push(key);
          return '([^/]+)';
        });
      const regex = new RegExp(`^${patternStr}$`);
      const match = pathname.match(regex);

      if (match) {
        const params = {};
        keys.forEach((key, index) => {
          params[key] = match[index + 1];
        });
        return { route, params };
      }
    }
    return null;
  }

  async handleRoute() {
    const pathname = window.location.pathname;
    const match = this.match(pathname);

    if (!match) {
      this.navigate('/');
      return;
    }

    const { route, params } = match;

    // Check Role Guard
    if (route.requiresAuth && !authStore.isAuthenticated()) {
      this.navigate('/login');
      return;
    }

    if (route.requiresAdmin && !authStore.isAdmin()) {
      alert('Khu vực dành riêng cho Quản trị viên!');
      this.navigate('/');
      return;
    }

    if (this.currentCleanUp && typeof this.currentCleanUp === 'function') {
      this.currentCleanUp();
      this.currentCleanUp = null;
    }

    const appContainer = document.getElementById('app');
    if (appContainer && route.component) {
      this.currentCleanUp = await route.component(appContainer, params);
    }
  }

  start() {
    this.handleRoute();
  }
}

export function createRouter(routes) {
  return new Router(routes);
}

