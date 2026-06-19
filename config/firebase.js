import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase konfigürasyonu - EF-DROP projesi
const firebaseConfig = {
  apiKey: "AIzaSyCzA-fD-kTK1_7vlk7TNS8-sffDq45iEcg",
  authDomain: "ef-drop.firebaseapp.com",
  projectId: "ef-drop",
  storageBucket: "ef-drop.appspot.com",
  messagingSenderId: "125028697704",
  appId: "1:125028697704:web:ef-drop-app"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firebase Auth'u AsyncStorage ile konfigüre et
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  // Eğer zaten başlatılmışsa, mevcut auth instance'ını kullan
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

// Firebase servislerini export et
export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 