// Service for user-related database operations
import db from '../config/database';
import { User } from '../models/user';

export const getUserByUID = (uid: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE UID = ?', [uid], (error: any, results: any[]) => {
      if (error) return reject(error);
      if (results.length > 0) {
        resolve(results[0] as User);
      } else {
        resolve(null);
      }
    });
  });
};

export const isUserAdmin = (uid: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE UID = ? AND is_admin = TRUE', [uid], (error: any, results: any[]) => {
      if (error) return reject(error);
      resolve(results.length > 0);
    });
  });
};

export const addUserVote = (uid: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO users (UID) VALUES (?)', [uid], (error: any) => {
      if (error) return reject(error);
      resolve();
    });
  });
};
