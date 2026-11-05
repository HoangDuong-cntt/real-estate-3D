import api from './axios';

export const propertyApi = {
  getTypes: () => api.get('/property-types'),
  getProperties: (params) => api.get('/properties', { params }),
  getPropertyBySlug: (slug) => api.get(`/properties/${slug}`),
  getFavorites: () => api.get('/favorites'),
  addFavorite: (propertyId) => api.post(`/favorites/${propertyId}`),
  removeFavorite: (propertyId) => api.delete(`/favorites/${propertyId}`),
};

