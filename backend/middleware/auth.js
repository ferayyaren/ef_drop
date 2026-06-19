const { auth } = require('../config/firebase-admin');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Erişim tokeni gerekli' 
      });
    }

    // Token'ı doğrula
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token doğrulama hatası:', error);
    return res.status(403).json({ 
      success: false, 
      error: 'Geçersiz token' 
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = decodedToken;
    }
    next();
  } catch (error) {
    // Token yoksa veya geçersizse devam et
    next();
  }
};

module.exports = { authenticateToken, optionalAuth }; 