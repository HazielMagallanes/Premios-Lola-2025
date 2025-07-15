// Service for state-related database operations
import db from '../config/database';
import { State } from '../models/state';

export const setVotingEnabled = (enabled: boolean): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE state SET enabled = ? WHERE ID = 1', [enabled], (error: any) => {
      if (error) return reject(error);
      resolve();
    });
  });
};

export const getVotingState = (): Promise<State | null> => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM state WHERE ID = 1', (error: any, results: any[]) => {
      if (error) return reject(error);
      if (results.length > 0) {
        resolve(results[0] as State);
      } else {
        resolve(null);
      }
    });
  });
};
