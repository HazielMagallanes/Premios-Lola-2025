// Express routes for voting state management
import { Router } from 'express';
import { setVotingEnabled } from '../services/stateService';
import { checkAdmin } from '../middlewares/checkAdmin';
import { enableVotesMiddleware } from '../middlewares/enable.votes.middleware';

const router = Router();

// Enable voting
router.post('/enable-votes', checkAdmin, enableVotesMiddleware, async (req, res) => {
  try {
    await setVotingEnabled(true, req.body.group);
    res.json({ enabled: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Disable voting
router.post('/disable-votes', checkAdmin, enableVotesMiddleware, async (req, res) => {
  try {
    await setVotingEnabled(false, req.body.group);
    res.json({ enabled: false });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
