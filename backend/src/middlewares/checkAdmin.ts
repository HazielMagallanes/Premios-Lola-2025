import { Request, Response, NextFunction } from 'express';
import { isUserAdmin } from '../services/userService';
export const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        if(token != process.env.ADMIN_TOKEN) {
            return res.status(403).json({ error: 'Access denied. Invalid admin token.' });
        }
        next();
    } catch (error) {
        console.error('Admin check error: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};