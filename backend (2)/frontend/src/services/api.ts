import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://https://kisanmitr.up.railway.app//api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const login = (username: string, password: string) =>
  api.post('/auth/login', { username, password });

export const register = (username: string, email: string, password: string, farmerName?: string, location?: string, phone?: string) =>
  api.post('/auth/register', { username, email, password, farmerName, location, phone });

export const getCurrentUser = () =>
  api.get('/auth/me');

// Certificates API
export const getMyCertificates = () =>
  api.get('/certificates/my-certificates');

export const uploadImage = (formData: FormData) =>
  api.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const getAnalysis = (analysisId: string) =>
  api.get(`/analysis/${analysisId}`);

export const getCertificate = (analysisId: string) =>
  api.get(`/certificate/${analysisId}`, { responseType: 'blob' });

