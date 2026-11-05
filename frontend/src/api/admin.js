import api from './axios';

export const adminApi = {
  // Properties
  getProperties: (params) => api.get('/admin/properties', { params }),
  createProperty: (formData) =>
    api.post('/admin/properties', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateProperty: (id, data) => api.put(`/admin/properties/${id}`, data),
  deleteProperty: (id) => api.delete(`/admin/properties/${id}`),

  // 3D Models
  uploadModel: (propertyId, formData) =>
    api.post(`/admin/properties/${propertyId}/models`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateModelSettings: (modelId, data) => api.put(`/admin/models/${modelId}`, data),
  deleteModel: (modelId) => api.delete(`/admin/models/${modelId}`),

  // Hotspots
  addHotspot: (modelId, data) => api.post(`/admin/models/${modelId}/hotspots`, data),
  deleteHotspot: (hotspotId) => api.delete(`/admin/hotspots/${hotspotId}`),

  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Inquiries
  getInquiries: (params) => api.get('/admin/inquiries', { params }),
  updateInquiryStatus: (id, status) => api.put(`/admin/inquiries/${id}/status`, { status }),
};

