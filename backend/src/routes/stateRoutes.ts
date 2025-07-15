// Express routes for voting state management
import { Router } from 'express';
import { setVotingEnabled } from '../services/stateService';

const router = Router();

// Enable voting
router.get('/enable-votes', async (req, res) => {
  try {
    await setVotingEnabled(true);
    res.json({ enabled: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Disable voting
router.get('/disable-votes', async (req, res) => {
  try {
    await setVotingEnabled(false);
    res.json({ enabled: false });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
