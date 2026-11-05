class AuthStore {
  constructor() {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    this.token = localStorage.getItem('token') || null;
    this.listeners = [];
  }

  setAuth(user, token) {
    this.user = user;
    this.token = token;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    this.notify();
  }

  clearAuth() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.notify();
  }

  isAuthenticated() {
    return !!this.token;
  }

  isAdmin() {
    return this.user && this.user.role === 'admin';
  }

  getUser() {
    return this.user;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.user));
  }
}

export const authStore = new AuthStore();

