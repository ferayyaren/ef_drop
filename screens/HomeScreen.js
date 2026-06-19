import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  ActivityIndicator 
} from 'react-native';
import { DataService } from '../services/dataService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [boy, setBoy] = useState('');
  const [kilo, setKilo] = useState('');
  const [suIhtiyaci, setSuIhtiyaci] = useState(null);
  const [bugunIcilen, setBugunIcilen] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadUserProfile();
    loadTodayStats();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await AsyncStorage.getItem('userProfile');
      if (profile) {
        const parsedProfile = JSON.parse(profile);
        setUserProfile(parsedProfile);
        // Kilo bilgisi varsa hesaplama yap
        if (parsedProfile.weight) {
          hesapla(null, parsedProfile.weight);
        }
      }
    } catch (error) {
      console.error('Kullanıcı profili yükleme hatası:', error);
    }
  };

  const loadTodayStats = async () => {
    try {
      setLoading(true);
      const result = await DataService.getUserActivities();
      if (result.success) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayActivities = result.data.filter(activity => {
          const activityDate = new Date(activity.createdAt);
          return activityDate >= today && activity.type === 'su_icme';
        });

        const totalAmount = todayActivities.reduce((sum, activity) => {
          return sum + (activity.amount || 0);
        }, 0);

        setBugunIcilen(totalAmount);
      }
    } catch (error) {
      console.error('İstatistik yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const hesapla = (boyValue = boy, kiloValue = kilo) => {
    const boyNum = parseFloat(boyValue);
    const kiloNum = parseFloat(kiloValue);

    if (isNaN(boyNum) || isNaN(kiloNum)) {
      Alert.alert('Hata', 'Lütfen geçerli sayılar giriniz.');
      return;
    }

    const ihtiyac = (kiloNum * 0.033).toFixed(2); // litre
    setSuIhtiyaci(ihtiyac);
    
    // Kullanıcı tercihlerini kaydet
    saveUserPreferences(boyValue, kiloValue, ihtiyac);
  };

  const saveUserPreferences = async (height, weight, dailyGoal) => {
    try {
      await DataService.updateUserProfile({
        preferences: {
          height,
          weight,
          dailyGoal: parseFloat(dailyGoal)
        }
      });
    } catch (error) {
      console.error('Tercih kaydetme hatası:', error);
    }
  };

  const suIcti = async (miktar = 250) => {
    try {
      setLoading(true);
      const activityData = {
        title: `${miktar}ml su içildi`,
        description: 'Su içme aktivitesi',
        type: 'su_icme',
        amount: miktar,
        unit: 'ml'
      };

      const result = await DataService.saveUserActivity(activityData);
      if (result.success) {
        setBugunIcilen(prev => prev + miktar);
        Alert.alert('Başarılı', `${miktar}ml su kaydedildi!`);
      } else {
        Alert.alert('Hata', 'Su kaydedilemedi');
      }
    } catch (error) {
      Alert.alert('Hata', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Çıkış yap butonunu kaldırma

  const hedefYuzdesi = suIhtiyaci ? (bugunIcilen / (suIhtiyaci * 1000)) * 100 : 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Su Hatırlatıcım</Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Günlük Su İhtiyacını Hesapla</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Boy (cm)"
          keyboardType="numeric"
          value={boy}
          onChangeText={setBoy}
        />
        <TextInput
          style={styles.input}
          placeholder="Kilo (kg)"
          keyboardType="numeric"
          value={kilo}
          onChangeText={setKilo}
        />

        <TouchableOpacity style={styles.calculateButton} onPress={() => hesapla()}>
          <Text style={styles.calculateButtonText}>Su İhtiyacını Hesapla</Text>
        </TouchableOpacity>

        {suIhtiyaci && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              Günlük su ihtiyacın: {suIhtiyaci} litre
            </Text>
            <Text style={styles.resultText}>
              Bugün içilen: {bugunIcilen}ml / {parseFloat(suIhtiyaci) * 1000}ml
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min(hedefYuzdesi, 100)}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              %{Math.round(hedefYuzdesi)} tamamlandı
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actionSection}>
        <Text style={styles.sectionTitle}>Su İç</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.waterButton} 
            onPress={() => suIcti(250)}
            disabled={loading}
          >
            <Text style={styles.waterButtonText}>250ml</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.waterButton} 
            onPress={() => suIcti(500)}
            disabled={loading}
          >
            <Text style={styles.waterButtonText}>500ml</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.waterButton} 
            onPress={() => suIcti(1000)}
            disabled={loading}
          >
            <Text style={styles.waterButtonText}>1L</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00B1FC" />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2FAFD',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  logoutButton: {
    padding: 10,
  },
  logoutText: {
    color: '#00B1FC',
    fontSize: 14,
  },
  inputSection: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#00B1FC',
    padding: 15,
    marginBottom: 15,
    borderRadius: 25,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  calculateButton: {
    backgroundColor: '#00B1FC',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#E4F5FC',
    borderRadius: 10,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 20,
    backgroundColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00B1FC',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  actionSection: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  waterButton: {
    backgroundColor: '#E4F5FC',
    borderColor: '#00B1FC',
    borderWidth: 1,
    padding: 15,
    borderRadius: 25,
    minWidth: 80,
    alignItems: 'center',
  },
  waterButtonText: {
    color: '#00B1FC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
