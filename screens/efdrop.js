import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, Dimensions } from 'react-native';
import { useFonts } from 'expo-font'; // useFonts hook'unu import edin
import * as SplashScreen from 'expo-splash-screen'; // SplashScreen'i import edin

// Splash screen'in otomatik gizlenmesini engelle
SplashScreen.preventAutoHideAsync();

const { height, width } = Dimensions.get('window');

const waterDropImage = require('../assets/water_drop.png');
const wavesImage = require('../assets/waves.png');

export default function Efdrop() {
  // useFonts hook'u ile fontları yükleyin
  const [fontsLoaded] = useFonts({
    'Mynerve': require('../assets/fonts/Mynerve-Regular.ttf'), // Font dosyanızın yolu ve kullanmak istediğiniz isim
    // Eğer farklı font ağırlıkları veya stilleri varsa buraya ekleyin:
    // 'Mynerve-Bold': require('./assets/fonts/Mynerve-Bold.ttf'),
  });

  // Fontlar yüklendikten sonra splash screen'i gizle
  useEffect(() => {
    async function hideSplashScreen() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    hideSplashScreen();
  }, [fontsLoaded]);

  // Eğer fontlar yüklenmediyse null döndür, böylece hiçbir şey render edilmez
  if (!fontsLoaded) {
    return null; // Veya bir yükleme göstergesi (ActivityIndicator) döndürebilirsiniz
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Su Damlası */}
      <View style={styles.waterDropContainer}>
        <Image
          source={waterDropImage}
          style={styles.waterDrop}
          resizeMode="contain"
        />
      </View>

      {/* Dalgalar Resmi - Ekranın en altına sabit */}
      <Image
        source={wavesImage}
        style={styles.waves}
        resizeMode="cover"
      />

      {/* Uygulama Adı - Dalganın üzerine konumlandırıldı ve font uygulandı */}
      <Text style={styles.appNameOnWaves}>EF DROP</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  waterDropContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterDrop: {
    width: width * 0.9,
    height: width * 0.9,
  },
  waves: {
    width: '100%',
    height: 400,
    position: 'absolute',
    bottom: 0,
  },
  appNameOnWaves: {
    fontSize: 30, // Fontu daha net görmek için boyutu büyüttüm
    color: '#add8e6',
    position: 'absolute',
    bottom: 380, // Bu değeri dalganın yüksekliğine ve fontun boyutuna göre ayarlayın
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Mynerve', // Burası kritik: Yüklediğiniz fontun adını kullanın
  },
});