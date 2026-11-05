import { createRouter } from './router';
import { HomePage } from './pages/Home';
import { PropertyListPage } from './pages/PropertyList';
import { PropertyDetail3DPage } from './pages/PropertyDetail3D';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { AdminDashboardPage } from './pages/admin/Dashboard';
import { PropertyFormPage } from './pages/admin/PropertyForm';
import { UploadModelPage } from './pages/admin/UploadModel';
import { AdminUsersPage } from './pages/admin/Users';
import { AdminInquiriesPage } from './pages/admin/Inquiries';

const routes = [
  { path: '/', component: (el, p) => HomePage(el, p, router) },
  { path: '/properties', component: (el, p) => PropertyListPage(el, p, router) },
  { path: '/property/:slug', component: (el, p) => PropertyDetail3DPage(el, p, router) },
  { path: '/login', component: (el, p) => LoginPage(el, p, router) },
  { path: '/register', component: (el, p) => RegisterPage(el, p, router) },

  // Admin Protected Routes
  {
    path: '/admin/dashboard',
    requiresAuth: true,
    requiresAdmin: true,
    component: (el, p) => AdminDashboardPage(el, p, router),
  },
  {
    path: '/admin/properties/create',
    requiresAuth: true,
    requiresAdmin: true,
    component: (el, p) => PropertyFormPage(el, p, router),
  },
  {
    path: '/admin/properties/:id/upload-model',
    requiresAuth: true,
    requiresAdmin: true,
    component: (el, p) => UploadModelPage(el, p, router),
  },
  {
    path: '/admin/users',
    requiresAuth: true,
    requiresAdmin: true,
    component: (el, p) => AdminUsersPage(el, p, router),
  },
  {
    path: '/admin/inquiries',
    requiresAuth: true,
    requiresAdmin: true,
    component: (el, p) => AdminInquiriesPage(el, p, router),
  },
];

const router = createRouter(routes);
router.start();

