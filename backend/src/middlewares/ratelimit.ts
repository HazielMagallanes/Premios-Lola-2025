import { Request, Response, NextFunction } from 'express';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { config } from 'dotenv';

config({ path: "../.env", override: true });

var rateLimitList = new Map<DecodedIdToken, { count: number; lastRequest: number }>();

export const ratelimitCheck = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as DecodedIdToken;
    const now = Date.now();
    const rateLimit = rateLimitList.get(user) || { count: 0, lastRequest: 0 };
    if (rateLimit.lastRequest && now - rateLimit.lastRequest < 1000) {
        rateLimit.count++;
    } else {
        rateLimit.count = 1;
    }
    rateLimit.lastRequest = now;
    rateLimitList.set(user, rateLimit);
    if (rateLimit.count > (process.env.RATELIMIT_SECOND ? parseInt(process.env.RATELIMIT_SECOND) : 5)) {
        return res.status(429).send('Muchas peticiones. Tomate un respiro xD.');
    }
    next();
};