const express = require('express');
const { auth } = require('../config/firebase-admin');
const { authenticateToken } = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Kullanıcı kaydı
router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    // Validasyon
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      displayName: Joi.string().min(2).max(50).required()
    });

    const { error } = schema.validate({ email, password, displayName });
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Kullanıcı oluştur
    const userRecord = await auth.createUser({
      email,
      password,
      displayName
    });

    res.status(201).json({
      success: true,
      message: 'Kullanıcı başarıyla oluşturuldu',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName
      }
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Kullanıcı girişi (token alma)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasyon
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    });

    const { error } = schema.validate({ email, password });
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Kullanıcıyı doğrula ve token oluştur
    const userRecord = await auth.getUserByEmail(email);
    
    // Custom token oluştur (gerçek uygulamada client-side authentication kullanılmalı)
    const customToken = await auth.createCustomToken(userRecord.uid);

    res.json({
      success: true,
      message: 'Giriş başarılı',
      token: customToken,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName
      }
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(401).json({
      success: false,
      error: 'Geçersiz email veya şifre'
    });
  }
});

// Kullanıcı bilgilerini getir
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userRecord = await auth.getUser(req.user.uid);
    
    res.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        emailVerified: userRecord.emailVerified,
        createdAt: userRecord.metadata.creationTime
      }
    });
  } catch (error) {
    console.error('Kullanıcı bilgisi alma hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Kullanıcı çıkışı
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Firebase'de token'ı geçersiz kıl
    await auth.revokeRefreshTokens(req.user.uid);
    
    res.json({
      success: true,
      message: 'Çıkış başarılı'
    });
  } catch (error) {
    console.error('Çıkış hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 