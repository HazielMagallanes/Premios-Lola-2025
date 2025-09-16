import { Router } from 'express';
import { checkAdmin } from '../middlewares/checkAdmin';
import { getAllProposals } from '../services/voteService';

const router = Router();

router.get("/admin-test", checkAdmin, (req, res) => {
    return res.json({ isAdmin: true });
});

router.get("/admin/proposals", checkAdmin, async (req, res) => {  
    try {
        const votes = await getAllProposals();
        // Transform Vote[] to Proposal[]
        const proposals = votes.map(vote => ({
          ID: vote.ID,
          school: vote.school,
          name: vote.name,
          logo: vote.logo,
          votes: vote.votes,
          group: vote.group
        }));
        res.json(proposals);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
});

export default router;