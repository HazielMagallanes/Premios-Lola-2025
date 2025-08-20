// Express routes for voting and proposals
import { Router } from 'express';
import { verifyToken } from '../middlewares/auth';
import { getVoteById, incrementVote, getAllProposals, createProposal } from '../services/voteService';
import { getUserByUID, addUserVote } from '../services/userService';
import { getVotingState } from '../services/stateService';
import type {
  GetVoteByIdResponse,
  VoteRecordedResponse,
  VoteErrorResponse,
  GetAllProposalsResponse,
  CreateProposalRequest,
  CreateProposalResponse
} from '../types/voteRoutes';

const router = Router();

// Get vote amount of a given id
router.get<
  { id: string },
  GetVoteByIdResponse | VoteErrorResponse
>('/votes/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const vote = await getVoteById(id);
    if (vote) {
      res.json({ votes: vote.votes });
    } else {
      res.status(404).json({ error: 'No entry found with the given ID' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add a vote to a given ID
router.post<
  { id: string },
  VoteRecordedResponse | VoteErrorResponse
>('/votes/:id', verifyToken, async (req, res) => {
  const id = Number(req.params.id);
  const userId = (req as any).user.uid;
  if (!userId) return res.status(400).json({ error: 'User ID is missing' });
  try {
    const state = await getVotingState();
    if (!state || !state.enabled) return res.status(403).json({ error: 'La votación esta deshabilitada, solo puedes votar durante el evento.' });
    const user = await getUserByUID(userId);
    if (user && user.UID !== process.env.VOTE_MASTER) {
      return res.status(403).json({ error: 'ERROR: User tried to vote but has already voted. Is this correct?' });
    }
    const vote = await getVoteById(id);
    if (!vote) return res.status(404).json({ error: 'No entries found with the given ID' });
    await incrementVote(id);
    await addUserVote(userId);
    res.json({ message: `Vote recorded for proposal ${id}.` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all proposals
router.get<
  {},
  GetAllProposalsResponse | VoteErrorResponse
>('/proposals', verifyToken, async (req, res) => {
  try {
    const votes = await getAllProposals();
    // Transform Vote[] to Proposal[]
    const proposals = votes.map(vote => ({
      id: vote.ID,
      name: vote.name,
      logo: vote.logo,
      group: String(vote.group),
      votes: vote.votes
    }));
    res.json(proposals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new proposal
router.post<
  {},
  CreateProposalResponse | VoteErrorResponse,
  CreateProposalRequest
>('/proposals', async (req, res) => {
  const { name, logo, group } = req.body;
  try {
    // Assuming createProposal expects (group: number, name: string, logo: string)
  const proposalId = await createProposal(name, logo, Number(group));
    res.json({ message: 'Proposal created successfully', proposalId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
