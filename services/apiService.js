import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URL - Backend'inizin URL'sini buraya yazın
const API_BASE_URL = 'http://localhost:3000/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Token ekle
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Token alma hatası:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Hata yönetimi
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz, kullanıcıyı çıkış yaptır
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      // Burada navigation ile login sayfasına yönlendirme yapabilirsiniz
    }
    return Promise.reject(error);
  }
);

export class ApiService {
  // Authentication endpoints
  static async register(email, password, displayName) {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        displayName
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Kayıt hatası');
    }
  }

  static async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      // Token'ı kaydet
      if (response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Giriş hatası');
    }
  }

  static async logout() {
    try {
      await api.post('/auth/logout');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      return { success: true };
    } catch (error) {
      console.error('Çıkış hatası:', error);
      // Token'ları yine de temizle
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      return { success: true };
    }
  }

  static async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Kullanıcı bilgisi alma hatası');
    }
  }

  // User profile endpoints
  static async getUserProfile() {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Profil getirme hatası');
    }
  }

  static async updateUserProfile(profileData) {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Profil güncelleme hatası');
    }
  }

  static async getUserStats(period = 'all') {
    try {
      const response = await api.get(`/users/stats?period=${period}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'İstatistik getirme hatası');
    }
  }

  // Activity endpoints
  static async createActivity(activityData) {
    try {
      const response = await api.post('/activities', activityData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'İşlem kaydetme hatası');
    }
  }

  static async getActivities(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/activities?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'İşlem getirme hatası');
    }
  }

  static async getActivity(id) {
    try {
      const response = await api.get(`/activities/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'İşlem getirme hatası');
    }
  }

  static async updateActivity(id, updateData) {
    try {
      const response = await api.put(`/activities/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'İşlem güncelleme hatası');
    }
  }

  static async deleteActivity(id) {
    try {
      const response = await api.delete(`/activities/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'İşlem silme hatası');
    }
  }

  static async getActivityStats(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/activities/stats/summary?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'İstatistik getirme hatası');
    }
  }

  // Utility methods
  static async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }

  static async getStoredUser() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  static async clearStoredData() {
    try {
      await AsyncStorage.multiRemove(['authToken', 'userData']);
    } catch (error) {
      console.error('Veri temizleme hatası:', error);
    }
  }
}

export default api; 