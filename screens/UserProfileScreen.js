import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Alert,
  ActivityIndicator 
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const UserProfileScreen = ({ navigation, route }) => {
  // Check if coming from GenderScreen
  useEffect(() => {
    if (route.params?.fromGenderScreen && !userProfile.gender) {
      navigation.navigate('GenderScreen');
    }
  }, [route.params?.fromGenderScreen, userProfile.gender]);
  const [loading, setLoading] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [userProfile, setUserProfile] = useState({
    weight: '',
    gender: '',
    age: '',
    exerciseStatus: '',
    sleepTime: '',
    wakeTime: ''
  });

  const genders = ['Erkek', 'Kadın'];
  const exerciseStatusOptions = ['Az hareketli', 'Orta seviye', 'Aktif'];

  const saveUserProfile = async () => {
    if (!userProfile.gender) {
      navigation.navigate('GenderScreen', { fromProfile: true });
      return;
    }
    
    if (!userProfile.weight || !userProfile.age || !userProfile.exerciseStatus || !userProfile.sleepTime || !userProfile.wakeTime) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
      navigation.navigate('HomeScreen');
    } catch (error) {
      Alert.alert('Hata', 'Profil kaydedilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KULLANICI PROFİLİ</Text>
      
      <View style={styles.formBox}>
        <Text style={styles.label}>Kilo (kg):</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Kilonuzu girin" 
          keyboardType="numeric"
          value={userProfile.weight}
          onChangeText={(text) => setUserProfile({...userProfile, weight: text})}
        />

        <Text style={styles.label}>Cinsiyet:</Text>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity 
            style={[styles.dropdown, userProfile.gender && styles.dropdownSelected]}
            onPress={() => setGenderModalVisible(true)}
          >
            <Text style={styles.dropdownText}>
              {userProfile.gender || 'Cinsiyet seçin'}
            </Text>
          </TouchableOpacity>
          {genderModalVisible && (
            <View style={styles.modalOptions}>
              {genders.map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={styles.modalOption}
                  onPress={() => {
                    setUserProfile({...userProfile, gender});
                    setGenderModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{gender}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Text style={styles.label}>Yaş:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Yaşınızı girin" 
          keyboardType="numeric"
          value={userProfile.age}
          onChangeText={(text) => setUserProfile({...userProfile, age: text})}
        />

        <Text style={styles.label}>Hareket Durumu:</Text>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity 
            style={[styles.dropdown, userProfile.exerciseStatus && styles.dropdownSelected]}
            onPress={() => setExerciseModalVisible(true)}
          >
            <Text style={styles.dropdownText}>
              {userProfile.exerciseStatus || 'Hareket durumu seçin'}
            </Text>
          </TouchableOpacity>
          {exerciseModalVisible && (
            <View style={styles.modalOptions}>
              {exerciseStatusOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.modalOption}
                  onPress={() => {
                    setUserProfile({...userProfile, exerciseStatus});
                    setExerciseModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Text style={styles.label}>Uyku Saati:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="HH:MM formatında girin" 
          value={userProfile.sleepTime}
          onChangeText={(text) => setUserProfile({...userProfile, sleepTime: text})}
        />

        <Text style={styles.label}>Uyanma Saati:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="HH:MM formatında girin" 
          value={userProfile.wakeTime}
          onChangeText={(text) => setUserProfile({...userProfile, wakeTime: text})}
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={saveUserProfile}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>KAYDET</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2FAFD',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  formBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
  },
  dropdownSelected: {
    backgroundColor: '#f0f0f0',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  modalOptions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOption: {
    padding: 10,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserProfileScreen;
