// Express routes for voting and proposals
import { Router } from 'express';
import { verifyToken } from '../middlewares/auth';
import { config } from 'dotenv';
import { ratelimitCheck } from '../middlewares/ratelimit';
import { checkAdmin } from '../middlewares/checkAdmin';
import { getVoteById, incrementVote, getAllProposals, createProposal } from '../services/voteService';
import { getUserByUID, addUserVote } from '../services/userService';
import { getVotingState } from '../services/stateService';
import { proposalCreateMiddleware } from '../middlewares/proposal.create.middleware';
import type {
  GetVoteByIdResponse,
  VoteRecordedResponse,
  VoteErrorResponse,
  GetAllProposalsResponse,
  CreateProposalRequest,
  CreateProposalResponse
} from '../types/voteRoutes';

const router = Router();

config({  path: '../.env', override: true }); // Load environment variables from .env file

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
>('/votes/:id', verifyToken, ratelimitCheck, async (req, res) => {
  const id = Number(req.params.id);
  const userId = (req as any).user.uid;
  if(!id) return res.status(400).json({ error: 'ID is missing or invalid' });
  if (!userId) return res.status(400).json({ error: 'User ID is missing' });
  try {
    const vote = await getVoteById(id);
    if(!vote) return res.status(404).json({ error: 'No entries found with the given ID' });
    const state = await getVotingState(vote.group);
    if (!state || !state.enabled) return res.status(403).json({ error: 'La votación esta deshabilitada para ese grupo, solo puedes votar durante el evento.' });
    const user = await getUserByUID(userId);
    console.log(Number(process.env.GROUP_ALLOW_REVOTE));
    if (user && user.UID !== process.env.VOTE_MASTER && vote.group != Number(process.env.GROUP_ALLOW_REVOTE)) {
      return res.status(403).json({ error: 'ERROR: User tried to vote but has already voted. Is this correct?' });
    }
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
>('/proposals', verifyToken, ratelimitCheck, async (req, res) => {
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

// Create a new proposal
router.post<
  {},
  CreateProposalResponse | VoteErrorResponse,
  CreateProposalRequest
>('/proposals', checkAdmin, proposalCreateMiddleware, async (req, res) => {
  const { school, name, logo, group } = req.body;

  try {
    // Assuming createProposal expects (school: string, name: string, logo: string, group: number)
    const proposalId = await createProposal(school, name, logo, Number(group));
    res.json({ message: 'Proposal created successfully', proposalId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
