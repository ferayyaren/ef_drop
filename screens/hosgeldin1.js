import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

const Hosgeldiniz1 = ({ navigation }) => {  // <-- navigation parametresini ekledik
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.contentContainer}>
        <View style={styles.imagesContainer}>
          <Image source={require('../assets/hosgeldin1.png')} style={styles.image1} />
          
        </View>

        <Text style={styles.title}>Sağlığınız Her Yudum Su İle Güçlenir!</Text>
        <Text style={styles.description}>
          Vücudunuzun %70'i sudan oluşur. Günlük su ihtiyacınızı karşılayarak
          enerjinizi artırın, cildinizi canlandırın ve zihinsel performansınızı
          yükseltin.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Hosgeldiniz2')} // navigation burada kullanılıyor
        >
          <Text style={styles.buttonText}>Devam Et</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 16,
    marginTop: 0,
    marginBottom: 32,
  },


image1: {
  width: width * 1.3,   // Genişliğin %70’i kadar
  height: width * 1.3,  // Yüksekliği de orantılı
  resizeMode: 'contain',
  right: -50, // Resmi sağa kaydır
},

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#000000',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#00B1FC',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Hosgeldiniz1;
