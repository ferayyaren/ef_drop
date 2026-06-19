# Su Hatırlatıcı - React Native + Node.js + Firebase

Bu proje, kullanıcıların günlük su tüketimini takip etmelerine yardımcı olan bir React Native uygulamasıdır. Node.js backend ve Firebase ile entegre edilmiştir.

## 🚀 Özellikler

- **Kullanıcı Authentication**: Firebase Authentication ile güvenli giriş/kayıt
- **Su Takibi**: Günlük su tüketimini kaydetme ve takip etme
- **İstatistikler**: Günlük, haftalık ve aylık istatistikler
- **Hedef Belirleme**: Kişisel su ihtiyacı hesaplama
- **Gerçek Zamanlı Veri**: Firebase Firestore ile anlık veri senkronizasyonu
- **REST API**: Node.js backend ile güçlü API desteği

## 📱 Teknolojiler

### Frontend (React Native)
- React Native
- Expo
- React Navigation
- Firebase SDK
- Axios
- AsyncStorage

### Backend (Node.js)
- Express.js
- Firebase Admin SDK
- Joi (Validasyon)
- Helmet (Güvenlik)
- CORS
- Rate Limiting

### Database & Authentication
- Firebase Authentication
- Firebase Firestore
- Firebase Storage

## 🛠️ Kurulum

### 1. Firebase Projesi Oluşturma

1. [Firebase Console](https://console.firebase.google.com/)'a gidin
2. Yeni proje oluşturun
3. Authentication'ı etkinleştirin (Email/Password)
4. Firestore Database'i oluşturun
5. Service Account Key'i indirin

### 2. Frontend Kurulumu

```bash
# Bağımlılıkları yükleyin
npm install

# Firebase konfigürasyonunu güncelleyin
# config/firebase.js dosyasındaki firebaseConfig'i güncelleyin

# Uygulamayı başlatın
npm start
```

### 3. Backend Kurulumu

```bash
# Backend dizinine gidin
cd backend

# Bağımlılıkları yükleyin
npm install

# Environment dosyasını oluşturun
cp env.example .env

# .env dosyasını güncelleyin
# Firebase service account bilgilerini ekleyin

# Backend'i başlatın
npm run dev
```

## 📁 Proje Yapısı

```
suhatirlatici/
├── assets/                 # Resimler ve fontlar
├── config/                 # Firebase konfigürasyonu
├── screens/               # React Native ekranları
├── services/              # API ve Firebase servisleri
├── backend/               # Node.js backend
│   ├── config/           # Backend konfigürasyonu
│   ├── middleware/       # Express middleware
│   ├── routes/           # API route'ları
│   └── server.js         # Ana server dosyası
└── README.md
```

## 🔧 Konfigürasyon

### Firebase Konfigürasyonu

1. `config/firebase.js` dosyasını güncelleyin:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

2. Backend için service account key'i `backend/serviceAccountKey.json` olarak kaydedin.

### API URL Konfigürasyonu

`services/apiService.js` dosyasında API URL'ini güncelleyin:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Mevcut kullanıcı bilgisi
- `POST /api/auth/logout` - Çıkış yapma

### Users
- `GET /api/users/profile` - Kullanıcı profili
- `PUT /api/users/profile` - Profil güncelleme
- `GET /api/users/stats` - Kullanıcı istatistikleri
- `DELETE /api/users/account` - Hesap silme

### Activities
- `POST /api/activities` - İşlem kaydetme
- `GET /api/activities` - İşlemleri listeleme
- `GET /api/activities/:id` - Belirli işlem
- `PUT /api/activities/:id` - İşlem güncelleme
- `DELETE /api/activities/:id` - İşlem silme
- `GET /api/activities/stats/summary` - İstatistikler

## 🔐 Güvenlik

- Firebase Authentication ile güvenli kullanıcı yönetimi
- JWT token tabanlı API authentication
- Rate limiting ile API koruması
- Input validasyonu
- CORS konfigürasyonu

## 📱 Kullanım

1. Uygulamayı açın
2. Kayıt olun veya giriş yapın
3. Boy ve kilo bilgilerinizi girin
4. Günlük su ihtiyacınızı hesaplayın
5. Su içtiğinizde miktarı kaydedin
6. İlerlemenizi takip edin

## 🚀 Deployment

### Frontend (Expo)
```bash
# Production build
expo build:android
expo build:ios
```

### Backend (Heroku/Netlify)
```bash
# Environment variables'ları ayarlayın
# Deploy edin
git push heroku main
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Proje hakkında sorularınız için issue açabilirsiniz.

## 🔄 Güncellemeler

- v1.0.0: İlk sürüm
- Firebase Authentication entegrasyonu
- Node.js backend API
- Su takip sistemi
- İstatistik ve raporlama 