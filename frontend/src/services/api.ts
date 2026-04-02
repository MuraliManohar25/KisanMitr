import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Axios instance ────────────────────────────────────────────────────────────

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: attach token ─────────────────────────────────────────

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Let axios set Content-Type automatically for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle errors globally ──────────────────────────────

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Token expired or invalid — clear and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      if (status === 413) {
        return Promise.reject(new Error('File too large. Please upload a smaller image.'));
      }

      if (status === 415) {
        return Promise.reject(new Error('Unsupported file type.'));
      }

      if (status >= 500) {
        return Promise.reject(new Error('Server error. Please try again later.'));
      }

      // Return backend error message if available
      const message = error.response.data?.error || error.response.data?.message || error.message;
      return Promise.reject(new Error(message));
    }

    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }

    if (!navigator.onLine) {
      return Promise.reject(new Error('No internet connection.'));
    }

    return Promise.reject(error);
  }
);

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  farmerName?: string;
  location?: string;
  phone?: string;
}

export interface DetectionResult {
  filename: string;
  count: number;
  label_summary: Record<string, number>;
  avg_confidence: number;
  grade: string;
  score: number;
  reason: string;
  detections: {
    label: string;
    confidence: number;
    bbox: { x1: number; y1: number; x2: number; y2: number };
  }[];
  inference_time_sec: number;
}

export interface AnalysisResult {
  analysisId: string;
  status: string;
  result?: DetectionResult;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const login = (
  username: string,
  password: string
): Promise<AxiosResponse<AuthResponse>> =>
  api.post('/auth/login', { username, password });

export const register = (
  payload: RegisterPayload
): Promise<AxiosResponse<AuthResponse>> =>
  api.post('/auth/register', payload);

export const getCurrentUser = (): Promise<AxiosResponse> =>
  api.get('/auth/me');

export const logout = (): void => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

// ── Certificates ──────────────────────────────────────────────────────────────

export const getMyCertificates = (): Promise<AxiosResponse> =>
  api.get('/certificates/my-certificates');

export const getCertificate = (analysisId: string): Promise<AxiosResponse<Blob>> =>
  api.get(`/certificate/${analysisId}`, { responseType: 'blob' });

// ── Image Analysis ────────────────────────────────────────────────────────────

export const uploadImage = (
  formData: FormData,
  onUploadProgress?: (percent: number) => void
): Promise<AxiosResponse<DetectionResult>> =>
  api.post('/analyze', formData, {
    onUploadProgress: (event) => {
      if (onUploadProgress && event.total)
