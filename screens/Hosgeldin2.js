import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

const Hosgeldiniz2 = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.contentContainer}>
        <View style={styles.imagesContainer}>
          <Image source={require('../assets/hosgeldin2.png')} style={styles.image1} />

        </View>

        <Text style={styles.title}>Su İçmek, Kendinizi Sevmenin En Basit Yolu!</Text>
        <Text style={styles.description}>
          Sadece 8 bardak su ile günün kahramanı olabilirsiniz.
          Yorgunluğa elveda deyin, canlılığa merhaba!
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('GenderScreen');
          }}
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
    marginTop: 32,
    marginBottom: 16,
  },
  imagesContainer: {
    width: width*1.2 ,
    height: width * 1.2 ,
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image1: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    position: 'absolute',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#121212',
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

export default Hosgeldiniz2;
