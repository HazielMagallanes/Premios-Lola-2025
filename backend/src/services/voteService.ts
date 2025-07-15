// Service for vote-related database operations
import db from '../config/database';
import { Vote } from '../models/vote';

export const getVoteById = (id: number): Promise<Vote | null> => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM votos WHERE ID = ?', [id], (error, results) => {
      if (error) return reject(error);
      if (results.length > 0) {
        resolve(results[0] as Vote);
      } else {
        resolve(null);
      }
    });
  });
};

export const incrementVote = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE votos SET votes = votes + 1 WHERE ID = ?', [id], (error) => {
      if (error) return reject(error);
      resolve();
    });
  });
};

export const getAllProposals = (): Promise<Vote[]> => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM votos', (error, results) => {
      if (error) return reject(error);
      resolve(results as Vote[]);
    });
  });
};

export const createProposal = (name: string, logo: string, group: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO votos (name, logo, `group`) VALUES (?, ?, ?)', [name, logo, group], (error, result) => {
      if (error) return reject(error);
      resolve(result.insertId);
    });
  });
};
