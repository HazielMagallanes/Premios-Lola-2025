// Service for state-related database operations
import db from '../config/database';
import { State } from '../models/state';

export const setVotingEnabled = (enabled: boolean, group: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE state SET enabled = ?, `group` = ? WHERE ID = ?', [enabled, group, group], (error: any) => {
      if (error) return reject(error);
      resolve();
    });
  });
};

export const getVotingState = (group: number): Promise<State | null> => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM state WHERE ID = ? AND `group` = ?', [group, group], (error: any, results: any[]) => {
      if (error) return reject(error);
      if (results.length > 0) {
        resolve(results[0] as State);
      } else {
        resolve(null);
      }
    });
  });
};
