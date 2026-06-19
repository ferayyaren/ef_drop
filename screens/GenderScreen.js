import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { DataService } from '../services/dataService';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GenderScreen = ({ route }) => {
  const [selectedGender, setSelectedGender] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await AsyncStorage.getItem('userProfile');
        if (profile) {
          const parsedProfile = JSON.parse(profile);
          if (parsedProfile.gender) {
            setSelectedGender(parsedProfile.gender);
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };
    loadUserProfile();
  }, []);

  const handleGenderSelect = async (gender) => {
    try {
      setSelectedGender(gender);
      const profile = await AsyncStorage.getItem('userProfile');
      const updatedProfile = profile ? JSON.parse(profile) : {};
      updatedProfile.gender = gender;
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      try {
        await DataService.updateUserProfile({ gender });
      } catch (error) {
        console.error('Error updating profile in database:', error);
      }
      navigation.navigate('AgeScreen', { 
        fromProfile: route.params?.fromProfile,
        fromGenderScreen: true 
      });
    } catch (error) {
      console.error('Error saving gender:', error);
      alert('Cinsiyet kaydedilirken bir hata oluştu');
    }
  };

  const handleBack = () => {
    if (route.params?.fromProfile) {
      navigation.goBack();
    } else {
      navigation.navigate('Hosgeldiniz2');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <Image 
          source={require('../assets/oktusugeri.png')} 
          style={styles.backIcon}
        />
      </TouchableOpacity>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressStep, styles.progressActive]} />
          <View style={[styles.progressStep, styles.progressInactive]} />
          <View style={[styles.progressStep, styles.progressInactive]} />
        </View>

        <Text style={styles.title}>Cinsiyetinizi Seçin</Text>
        
        <View style={styles.genderContainer}>
          <TouchableOpacity 
            style={[styles.genderButton, selectedGender === 'male' && styles.selectedGender]}
            onPress={() => handleGenderSelect('male')}
          >
            <Image 
              source={require('../assets/male.png')} 
              style={styles.genderImage}
              resizeMode="contain"
            />
            <Text style={styles.genderText}>Erkek</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.genderButton, selectedGender === 'female' && styles.selectedGender]}
            onPress={() => handleGenderSelect('female')}
          >
            <Image 
              source={require('../assets/female.png')} 
              style={styles.genderImage}
              resizeMode="contain"
            />
            <Text style={styles.genderText}>Kadın</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2FAFD',

  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center', // içeriği ortalamak için
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backIcon: {
    width: 35,
    height: 35,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  progressStep: {
    width: 30,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 5,
  },
  progressActive: {
    backgroundColor: '#00B1FC',
  },
  progressInactive: {
    backgroundColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    marginTop: 40,
    color: '#2C3E50',
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily: 'Manrope'
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  genderButton: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'white',
    width: '45%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 5,
  },
  selectedGender: {
    borderWidth: 3,
    borderColor: '#3498DB',
  },
  genderImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  genderText: {
    fontSize: 18,
    color: '#2C3E50',
    marginTop: 10,
    fontFamily: 'Manrope'
  },
});

export default GenderScreen;
