import AsyncStorage from '@react-native-async-storage/async-storage';

export class DataService {
  // Kullanıcı işlemlerini kaydet
  static async saveUserActivity(activityData) {
    try {
      const activities = await AsyncStorage.getItem('userActivities');
      const parsedActivities = activities ? JSON.parse(activities) : [];
      
      const newActivity = {
        ...activityData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const updatedActivities = [...parsedActivities, newActivity];
      await AsyncStorage.setItem('userActivities', JSON.stringify(updatedActivities));
      
      return { success: true, data: newActivity };
    } catch (error) {
      console.error('İşlem kaydetme hatası:', error);
      return { success: false, error: error.message };
    }
  }

  // Kullanıcının işlemlerini getir
  static async getUserActivities() {
    try {
      const activities = await AsyncStorage.getItem('userActivities');
      const parsedActivities = activities ? JSON.parse(activities) : [];
      
      // Sıralama yap
      const sortedActivities = [...parsedActivities].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      return { success: true, data: sortedActivities };
    } catch (error) {
      console.error('İşlem getirme hatası:', error);
      return { success: false, error: error.message };
    }
  }

  // İşlem güncelle
  static async updateUserActivity(activityId, updateData) {
    try {
      const activities = await AsyncStorage.getItem('userActivities');
      const parsedActivities = activities ? JSON.parse(activities) : [];
      
      const updatedActivities = parsedActivities.map(activity => 
        activity.id === activityId 
          ? { ...activity, ...updateData, updatedAt: new Date().toISOString() }
          : activity
      );
      
      await AsyncStorage.setItem('userActivities', JSON.stringify(updatedActivities));
      return { success: true };
    } catch (error) {
      console.error('İşlem güncelleme hatası:', error);
      return { success: false, error: error.message };
    }
  }

  // İşlem sil
  static async deleteUserActivity(activityId) {
    try {
      const activities = await AsyncStorage.getItem('userActivities');
      const parsedActivities = activities ? JSON.parse(activities) : [];
      
      const updatedActivities = parsedActivities.filter(activity => activity.id !== activityId);
      await AsyncStorage.setItem('userActivities', JSON.stringify(updatedActivities));
      return { success: true };
    } catch (error) {
      console.error('İşlem silme hatası:', error);
      return { success: false, error: error.message };
    }
  }

  // Kullanıcı profilini güncelle
  static async updateUserProfile(profileData) {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify({
        ...profileData,
        updatedAt: new Date().toISOString()
      }));
      return { success: true };
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      return { success: false, error: error.message };
    }
  }

  // İstatistikleri getir
  static async getUserStats() {
    try {
      const activities = await AsyncStorage.getItem('userActivities');
      const parsedActivities = activities ? JSON.parse(activities) : [];
      
      // İstatistikleri hesapla
      const stats = {
        totalActivities: parsedActivities.length,
        thisWeek: parsedActivities.filter(activity => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(activity.createdAt) > weekAgo;
        }).length,
        thisMonth: parsedActivities.filter(activity => {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return new Date(activity.createdAt) > monthAgo;
        }).length
      };
      
      return { success: true, data: stats };
    } catch (error) {
      console.error('İstatistik getirme hatası:', error);
      return { success: false, error: error.message };
    }
  }
} 