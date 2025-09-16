// Express routes for user-related endpoints
import { Router } from 'express';
import { verifyToken } from '../middlewares/auth';
import { getUserByUID, isUserAdmin } from '../services/userService';
import { ratelimitCheck } from '../middlewares/ratelimit';

const router = Router();

// Get if user voted
router.get('/user-vote-status', verifyToken, ratelimitCheck, async (req, res) => {
  const userId = (req as any).user.uid;
  try {
    const user = await getUserByUID(userId);
    res.json({ hasVoted: !!user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get if user has admin perms
router.get('/user-is-admin', verifyToken, ratelimitCheck, async (req, res) => {
  const userId = (req as any).user.uid;
  try {
    const isAdmin = await isUserAdmin(userId);
    res.json({ isAdmin });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
