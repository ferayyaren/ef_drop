import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  SafeAreaView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataService } from '../services/dataService';

const AgeScreen = () => {
  const [age, setAge] = useState(18);
  const [isAgeValid, setIsAgeValid] = useState(true);
  
  // Yaş aralığı
  const minAge = 1;
  const maxAge = 120;
  
  // Önceki ve sonraki yaşları hesapla
  const prevAge = age > minAge ? age - 1 : null;
  const nextAge = age < maxAge ? age + 1 : null;
  const navigation = useNavigation();
  const route = useRoute();

  // Load previously saved age if exists
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await AsyncStorage.getItem('userProfile');
        if (profile) {
          const parsedProfile = JSON.parse(profile);
          if (parsedProfile.age) {
            setAge(parsedProfile.age.toString());
            setIsAgeValid(true);
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };
    
    loadUserProfile();
  }, []);

  const handleAgeChange = (newAge) => {
    // Yaş sınırlarını kontrol et
    newAge = Math.round(newAge);
    if (newAge < minAge) newAge = minAge;
    if (newAge > maxAge) newAge = maxAge;
    
    setAge(newAge);
    setIsAgeValid(true);
  };

  const handleContinue = async () => {
    if (!isAgeValid) {
      alert('Lütfen geçerli bir yaş giriniz (1-120)');
      return;
    }

    try {
      // Save age to AsyncStorage
      const profile = await AsyncStorage.getItem('userProfile');
      const updatedProfile = profile ? JSON.parse(profile) : {};
      updatedProfile.age = parseInt(age);
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      
      // Save to database
      try {
        await DataService.updateUserProfile({ age: parseInt(age) });
      } catch (error) {
        console.error('Error updating profile in database:', error);
      }
      
      // Navigate to WeightScreen with the correct params
      navigation.navigate('WeightScreen', { 
        fromProfile: route.params?.fromProfile,
        fromAgeScreen: true 
      });
    } catch (error) {
      console.error('Error saving age:', error);
      alert('Yaş kaydedilirken bir hata oluştu');
    }
  };

  const handleBack = () => {
    if (route.params?.fromProfile) {
      navigation.goBack();
    } else {
      navigation.navigate('GenderScreen');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Navigasyon */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Image 
            source={require('../assets/oktusugeri.png')} 
            style={styles.backIcon}
          />
        </TouchableOpacity>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressStep, styles.progressActive]} />
          <View style={[styles.progressStep, styles.progressActive]} />
          <View style={[styles.progressStep, styles.progressInactive]} />
        </View>
      </View>
      
      {/* Ana İçerik */}
      <View style={styles.content}>
        <Text style={styles.title}>Kaç yaşındasın?</Text>
        
        <View style={styles.mainContent}>
          {/* Sol Taraf - İkon */}
          <View style={styles.iconContainer}>
            <Image 
              source={require('../assets/age_person.png')} 
              style={styles.personImage}
              resizeMode="contain"
            />
          </View>
          
          {/* Sağ Taraf - Yaş Seçici */}
          <View style={styles.pickerContainer}>
            <View style={styles.ageList}>
              {prevAge !== null && (
                <TouchableOpacity 
                  style={styles.ageItem}
                  onPress={() => handleAgeChange(prevAge)}
                >
                  <Text style={styles.otherAgeText}>{prevAge}</Text>
                </TouchableOpacity>
              )}
              
              <View style={styles.selectedAgeContainer}>
                <Text style={styles.selectedAge}>{age}</Text>
                <Text style={styles.yearsText}>yaş</Text>
              </View>
              
              {nextAge !== null && (
                <TouchableOpacity 
                  style={styles.ageItem}
                  onPress={() => handleAgeChange(nextAge)}
                >
                  <Text style={styles.otherAgeText}>{nextAge}</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.ageControls}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => handleAgeChange(age - 1)}
                disabled={age <= minAge}
              >
                <Text style={[styles.controlButtonText, age <= minAge && styles.disabledButton]}>-</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => handleAgeChange(age + 1)}
                disabled={age >= maxAge}
              >
                <Text style={[styles.controlButtonText, age >= maxAge && styles.disabledButton]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      
      {/* İlerle Butonu */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>İlerle</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2FAFD',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // space-between yerine center
    position: 'relative',  
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
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginTop: 60,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    width: '40%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  personImage: {
    width: '100%',
    height: '100%',
  },
  pickerContainer: {
    width: '50%',
    alignItems: 'center',
  },
  ageList: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  ageItem: {
    padding: 10,
  },
  otherAgeText: {
    fontSize: 24,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  selectedAgeContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  selectedAge: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#00B1FC',
    textAlign: 'center',
  },
  yearsText: {
    fontSize: 20,
    color: '#00B1FC',
    fontWeight: '500',
    marginTop: -10,
  },
  ageControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  controlButtonText: {
    fontSize: 24,
    color: '#00B1FC',
    lineHeight: 20,
  },
  disabledButton: {
    color: '#CCCCCC',
  },
  footer: {
    padding: 40,
    paddingBottom: 70,
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#00B1FC',
    width: '70%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AgeScreen;
