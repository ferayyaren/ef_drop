const express = require('express');
const { auth, db, admin } = require('../config/firebase-admin');
const { authenticateToken } = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Kullanıcı profilini getir
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı profili bulunamadı'
      });
    }

    const userData = userDoc.data();

    res.json({
      success: true,
      data: {
        uid: userId,
        ...userData,
        createdAt: userData.createdAt?.toDate(),
        updatedAt: userData.updatedAt?.toDate()
      }
    });
  } catch (error) {
    console.error('Profil getirme hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Kullanıcı profilini güncelle
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { displayName, email, preferences } = req.body;

    // Validasyon
    const schema = Joi.object({
      displayName: Joi.string().min(2).max(50).optional(),
      email: Joi.string().email().optional(),
      preferences: Joi.object({
        dailyGoal: Joi.number().positive().optional(),
        reminderInterval: Joi.number().positive().optional(),
        theme: Joi.string().valid('light', 'dark', 'auto').optional(),
        notifications: Joi.boolean().optional()
      }).optional()
    });

    const { error } = schema.validate({ displayName, email, preferences });
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (displayName !== undefined) updateData.displayName = displayName;
    if (preferences !== undefined) updateData.preferences = preferences;

    // Firestore'da profil güncelle
    await db.collection('users').doc(userId).update(updateData);

    // Email değişikliği varsa Firebase Auth'ta da güncelle
    if (email) {
      await auth.updateUser(userId, { email });
    }

    // Display name değişikliği varsa Firebase Auth'ta da güncelle
    if (displayName) {
      await auth.updateUser(userId, { displayName });
    }

    res.json({
      success: true,
      message: 'Profil başarıyla güncellendi'
    });
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Kullanıcı istatistiklerini getir
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { period = 'all' } = req.query;

    let startDate = null;
    const now = new Date();

    // Dönem filtreleme
    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = null;
    }

    let query = db.collection('userActivities').where('userId', '==', userId);

    if (startDate) {
      query = query.where('createdAt', '>=', startDate);
    }

    const snapshot = await query.get();
    const activities = [];

    snapshot.forEach(doc => {
      activities.push(doc.data());
    });

    // İstatistikleri hesapla
    const stats = {
      totalActivities: activities.length,
      totalWaterAmount: 0,
      averageWaterPerDay: 0,
      streakDays: 0,
      byType: {}
    };

    // Tip bazında grupla
    activities.forEach(activity => {
      stats.byType[activity.type] = (stats.byType[activity.type] || 0) + 1;
      
      if (activity.type === 'su_icme' && activity.amount) {
        stats.totalWaterAmount += activity.amount;
      }
    });

    // Günlük ortalama su miktarı
    if (activities.length > 0) {
      const daysDiff = startDate ? 
        Math.ceil((now - startDate) / (1000 * 60 * 60 * 24)) : 
        Math.ceil((now - new Date(activities[0].createdAt.toDate())) / (1000 * 60 * 60 * 24));
      
      stats.averageWaterPerDay = daysDiff > 0 ? stats.totalWaterAmount / daysDiff : 0;
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('İstatistik getirme hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Kullanıcı hesabını sil
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    // Kullanıcının tüm işlemlerini sil
    const activitiesSnapshot = await db.collection('userActivities')
      .where('userId', '==', userId)
      .get();

    const batch = db.batch();
    activitiesSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Kullanıcı profilini sil
    batch.delete(db.collection('users').doc(userId));

    await batch.commit();

    // Firebase Auth'tan kullanıcıyı sil
    await auth.deleteUser(userId);

    res.json({
      success: true,
      message: 'Hesap başarıyla silindi'
    });
  } catch (error) {
    console.error('Hesap silme hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 