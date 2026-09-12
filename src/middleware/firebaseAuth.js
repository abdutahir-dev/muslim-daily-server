import { adminAuth } from '../lib/firebaseAdmin.js';

/**
 * Middleware to verify incoming Firebase ID Tokens passed in Authorization: Bearer <token>
 */
export const requireFirebaseAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing Firebase Bearer token in Authorization header' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('[auth] Error verifying Firebase ID token:', error && error.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired Firebase ID token' });
  }
};

/**
 * Optional Firebase Auth middleware: attaches user if present, continues if not
 */
export const optionalFirebaseAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      req.user = decodedToken;
    } catch {
      // Ignored for optional auth
    }
  }
  next();
};

export default { requireFirebaseAuth, optionalFirebaseAuth };
