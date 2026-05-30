import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach token to every request if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const logoutUser = () => API.delete('/auth/logout');
export const getMe = () => API.get('/auth/me');

// Listings
export const getListings = (params) => API.get('/listings', { params });
export const getListing = (id) => API.get(`/listings/${id}`);
export const createListing = (data) => API.post('/listings', data);
export const updateListing = (id, data) => API.patch(`/listings/${id}`, data);
export const deleteListing = (id) => API.delete(`/listings/${id}`);

// Saved
export const getSaved = () => API.get('/saved');
export const saveListing = (id) => API.post(`/saved/${id}`);
export const unsaveListing = (id) => API.delete(`/saved/${id}`);

// Inquiries
export const getInquiries = () => API.get('/inquiries');
export const createInquiry = (data) => API.post('/inquiries', data);
export const deleteInquiry = (id) => API.delete(`/inquiries/${id}`);