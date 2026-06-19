const express = require('express');
const { db, admin } = require('../config/firebase-admin');
const { authenticateToken } = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Kullanıcı işlemi kaydet
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, type, amount, unit } = req.body;
    const userId = req.user.uid;

    // Validasyon
    const schema = Joi.object({
      title: Joi.string().min(1).max(100).required(),
      description: Joi.string().max(500).optional(),
      type: Joi.string().valid('su_icme', 'hatirlatma', 'not', 'diger').required(),
      amount: Joi.number().positive().optional(),
      unit: Joi.string().valid('ml', 'bardak', 'adet').optional()
    });

    const { error } = schema.validate({ title, description, type, amount, unit });
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const activityData = {
      userId,
      title,
      description: description || '',
      type,
      amount: amount || null,
      unit: unit || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('userActivities').add(activityData);

    res.status(201).json({
      success: true,
      message: 'İşlem başarıyla kaydedildi',
      activityId: docRef.id
    });
  } catch (error) {
    console.error('İşlem kaydetme hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Kullanıcının işlemlerini getir
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { page = 1, limit = 20, type, startDate, endDate } = req.query;

    let query = db.collection('userActivities').where('userId', '==', userId);

    // Filtreleme
    if (type) {
      query = query.where('type', '==', type);
    }

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      query = query.where('createdAt', '>=', start).where('createdAt', '<=', end);
    }

    // Sıralama ve sayfalama
    query = query.orderBy('createdAt', 'desc')
                 .limit(parseInt(limit))
                 .offset((parseInt(page) - 1) * parseInt(limit));

    const snapshot = await query.get();
    const activities = [];

    snapshot.forEach(doc => {
      activities.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      });
    });

    res.json({
      success: true,
      data: activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: activities.length
      }
    });
  } catch (error) {
    console.error('İşlem getirme hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Belirli bir işlemi getir
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const doc = await db.collection('userActivities').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'İşlem bulunamadı'
      });
    }

    const data = doc.data();
    if (data.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Bu işleme erişim izniniz yok'
      });
    }

    res.json({
      success: true,
      data: {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      }
    });
  } catch (error) {
    console.error('İşlem getirme hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// İşlem güncelle
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    const { title, description, type, amount, unit } = req.body;

    // Validasyon
    const schema = Joi.object({
      title: Joi.string().min(1).max(100).optional(),
      description: Joi.string().max(500).optional(),
      type: Joi.string().valid('su_icme', 'hatirlatma', 'not', 'diger').optional(),
      amount: Joi.number().positive().optional(),
      unit: Joi.string().valid('ml', 'bardak', 'adet').optional()
    });

    const { error } = schema.validate({ title, description, type, amount, unit });
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const docRef = db.collection('userActivities').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'İşlem bulunamadı'
      });
    }

    const data = doc.data();
    if (data.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Bu işleme erişim izniniz yok'
      });
    }

    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (amount !== undefined) updateData.amount = amount;
    if (unit !== undefined) updateData.unit = unit;

    await docRef.update(updateData);

    res.json({
      success: true,
      message: 'İşlem başarıyla güncellendi'
    });
  } catch (error) {
    console.error('İşlem güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// İşlem sil
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const docRef = db.collection('userActivities').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'İşlem bulunamadı'
      });
    }

    const data = doc.data();
    if (data.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Bu işleme erişim izniniz yok'
      });
    }

    await docRef.delete();

    res.json({
      success: true,
      message: 'İşlem başarıyla silindi'
    });
  } catch (error) {
    console.error('İşlem silme hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// İstatistikleri getir
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { startDate, endDate } = req.query;

    let query = db.collection('userActivities').where('userId', '==', userId);

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      query = query.where('createdAt', '>=', start).where('createdAt', '<=', end);
    }

    const snapshot = await query.get();
    const activities = [];

    snapshot.forEach(doc => {
      activities.push(doc.data());
    });

    // İstatistikleri hesapla
    const stats = {
      totalActivities: activities.length,
      byType: {},
      totalAmount: 0,
      averageAmount: 0
    };

    activities.forEach(activity => {
      // Tip bazında sayım
      stats.byType[activity.type] = (stats.byType[activity.type] || 0) + 1;
      
      // Miktar hesaplama
      if (activity.amount) {
        stats.totalAmount += activity.amount;
      }
    });

    if (activities.length > 0) {
      stats.averageAmount = stats.totalAmount / activities.length;
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

module.exports = router; 