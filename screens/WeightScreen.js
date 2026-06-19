import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  TextInput, 
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataService } from '../services/dataService';

const WeightScreen = () => {
  const [weight, setWeight] = useState('');
  const [isWeightValid, setIsWeightValid] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  // Load previously saved weight if exists
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await AsyncStorage.getItem('userProfile');
        if (profile) {
          const parsedProfile = JSON.parse(profile);
          if (parsedProfile.weight) {
            setWeight(parsedProfile.weight.toString());
            setIsWeightValid(true);
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };
    
    loadUserProfile();
  }, []);

  const handleWeightChange = (text) => {
    // Only allow numbers and one decimal point
    const numericValue = text.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const decimalCount = (numericValue.match(/\./g) || []).length;
    if (decimalCount <= 1) {
      setWeight(numericValue);
      const weightValue = parseFloat(numericValue);
      setIsWeightValid(!isNaN(weightValue) && weightValue > 0 && weightValue <= 300);
    }
  };

  const handleContinue = async () => {
    if (!isWeightValid) {
      Alert.alert('Hata', 'Lütfen geçerli bir kilo giriniz (1-300 kg)');
      return;
    }

    try {
      // Save weight to AsyncStorage
      const profile = await AsyncStorage.getItem('userProfile');
      const updatedProfile = profile ? JSON.parse(profile) : {};
      updatedProfile.weight = parseFloat(weight);
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      
      // Save to database
      try {
        await DataService.updateUserProfile({ weight: parseFloat(weight) });
      } catch (error) {
        console.error('Error updating profile in database:', error);
      }
      
      // Navigate based on where we came from
      if (route.params?.fromProfile) {
        navigation.goBack();
      } else {
        navigation.navigate('UserProfileScreen', { fromWeightScreen: true });
      }
    } catch (error) {
      console.error('Error saving weight:', error);
      Alert.alert('Hata', 'Kilo kaydedilirken bir hata oluştu');
    }
  };

  const handleBack = () => {
    if (route.params?.fromProfile) {
      navigation.goBack();
    } else {
      navigation.navigate('AgeScreen');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
        
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressStep, styles.progressActive]} />
          <View style={[styles.progressStep, styles.progressActive]} />
          <View style={[styles.progressStep, styles.progressActive]} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Kilon nedir?</Text>
          
          <View style={styles.imageContainer}>
            <Image 
              source={require('../assets/weight_scale.png')} 
              style={styles.scaleImage}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, isWeightValid && weight !== '' ? styles.validInput : null]}
              placeholder="0.0"
              keyboardType="decimal-pad"
              value={weight}
              onChangeText={handleWeightChange}
              maxLength={5}
              autoFocus={true}
            />
            <Text style={styles.kgText}>kg</Text>
          </View>
          
          <Text style={styles.subtitle}>Kilonu öğrenerek su ihtiyacını daha doğru hesaplayalım</Text>
          
          <TouchableOpacity 
            style={[styles.continueButton, !isWeightValid && styles.disabledButton]}
            onPress={handleContinue}
            disabled={!isWeightValid}
            activeOpacity={0.7}
          >
            <Text style={styles.continueButtonText}>İlerle</Text>
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
  scrollView: {
    flex: 1,
    backgroundColor: '#F2FAFD',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F2FAFD',
    padding: 20,
    justifyContent: 'space-between',
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
    marginTop: 90,
  },
  progressStep: {
    width: 30,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  progressActive: {
    backgroundColor: '#00B1FC',
  },
  progressInactive: {
    backgroundColor: '#E0E0E0',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  imageContainer: {
    width: 200,
    height: 200,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleImage: {
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    maxWidth: 200,
    position: 'relative',
  },
  input: {
    flex: 1,
    height: 80,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 36,
    color: '#2C3E50',
    textAlign: 'center',
    backgroundColor: 'white',
    fontWeight: 'bold',
  },
  validInput: {
    borderColor: '#00B1FC',
  },
  kgText: {
    position: 'absolute',
    right: 20,
    fontSize: 24,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#00B1FC',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#B3E0FF',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WeightScreen;