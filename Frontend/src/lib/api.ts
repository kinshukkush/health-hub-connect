import axios from 'axios';
import type { User, Doctor, Appointment, MedicalRecord } from '@/types';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('healthhub_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('healthhub_token');
      localStorage.removeItem('healthcareUser');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// User APIs
export const userAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post<{ user: User; token: string }>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  register: async (data: any) => {
    const response = await api.post<{ user: User; token: string }>('/auth/register', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<User>('/users/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.patch<User>('/users/profile', data);
    return response.data;
  },
};

// Doctor APIs
export const doctorAPI = {
  getAll: async () => {
    const response = await api.get<any[]>('/doctors');
    // Transform _id to id for frontend compatibility
    return response.data.map((doc: any) => ({
      ...doc,
      id: doc._id,
    }));
  },

  getById: async (id: string) => {
    const response = await api.get<any>(`/doctors/${id}`);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  search: async (query: string) => {
    const response = await api.get<any[]>(`/doctors/search?q=${query}`);
    return response.data.map((doc: any) => ({
      ...doc,
      id: doc._id,
    }));
  },
};

// Appointment APIs
export const appointmentAPI = {
  getAll: async () => {
    const response = await api.get<any[]>('/appointments');
    return response.data.map((apt: any) => ({
      ...apt,
      id: apt._id,
    }));
  },

  getById: async (id: string) => {
    const response = await api.get<any>(`/appointments/${id}`);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  create: async (data: Partial<Appointment>) => {
    const response = await api.post<any>('/appointments', data);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  update: async (id: string, data: Partial<Appointment>) => {
    const response = await api.put<any>(`/appointments/${id}`, data);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  delete: async (id: string) => {
    await api.delete(`/appointments/${id}`);
  },
};

// Medical Records APIs
export const medicalRecordAPI = {
  getAll: async () => {
    const response = await api.get<any[]>('/records');
    return response.data.map((rec: any) => ({
      ...rec,
      id: rec._id,
    }));
  },

  getById: async (id: string) => {
    const response = await api.get<any>(`/records/${id}`);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  upload: async (formData: FormData) => {
    const response = await api.post<any>('/records', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  create: async (data: Partial<MedicalRecord>) => {
    const response = await api.post<any>('/records', data);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  delete: async (id: string) => {
    await api.delete(`/records/${id}`);
  },
};

// Alias for backward compatibility
export const recordAPI = medicalRecordAPI;

export default api;
