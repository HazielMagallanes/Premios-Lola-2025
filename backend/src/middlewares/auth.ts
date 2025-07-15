// Middleware for verifying Firebase ID tokens
import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase';

/**
 * Verifies the Firebase ID token from the Authorization header.
 * Adds the decoded user to request.user if valid.
 */
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};
