import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export class AuthService {
  // Kullanıcı kaydı
  static async registerUser(email, password, userData = {}) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Kullanıcı profilini güncelle
      await updateProfile(user, {
        displayName: userData.name || userData.displayName || 'Kullanıcı'
      });

      // Firestore'da kullanıcı bilgilerini kaydet
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: userData.name || userData.displayName || 'Kullanıcı',
        createdAt: new Date(),
        ...userData
      });

      return { success: true, user };
    } catch (error) {
      console.error('Kayıt hatası:', error);
      return { success: false, error: error.message };
    }
  }

  // Kullanıcı girişi
  static async loginUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Giriş hatası:', error);
      return { success: false, error: error.message };
    }
  }

  // Kullanıcı çıkışı
  static async logoutUser() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Çıkış hatası:', error);
      return { success: false, error: error.message };
    }
  }

  // Kullanıcı durumunu dinle
  static onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Mevcut kullanıcıyı al
  static getCurrentUser() {
    return auth.currentUser;
  }

  // Kullanıcı bilgilerini Firestore'dan al
  static async getUserData(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      } else {
        return { success: false, error: 'Kullanıcı bulunamadı' };
      }
    } catch (error) {
      console.error('Kullanıcı bilgisi alma hatası:', error);
      return { success: false, error: error.message };
    }
  }
} 