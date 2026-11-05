import api from './axios';

export const inquiryApi = {
  createInquiry: (data) => api.post('/inquiries', data),
  getMyInquiries: () => api.get('/my/inquiries'),
};

