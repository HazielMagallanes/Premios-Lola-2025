// Extend Express Request type to include 'user' property for testing
declare global {
	namespace Express {
		interface Request {
			user?: { uid: string };
		}
	}
}
import request from 'supertest';
import express, { NextFunction } from 'express';
import voteRoutes from '../src/routes/voteRoutes';
import { describe, expect, it, jest } from '@jest/globals';

// Mock services and middleware
jest.mock('../src/services/voteService', () => ({
	getVoteById: jest.fn((id) => id === 1 ? { votes: 5 } : null),
	incrementVote: jest.fn(),
	getAllProposals: jest.fn(() => [{ id: 1, name: 'Test Proposal' }]),
	createProposal: jest.fn(() => 123)
}));
jest.mock('../src/services/userService', () => ({
	getUserByUID: jest.fn((uid) => uid === 'master' ? { uid: 'master' } : null),
	addUserVote: jest.fn()
}));
jest.mock('../src/services/stateService', () => ({
	getVotingState: jest.fn(() => ({ enabled: true }))
}));
jest.mock('../src/middlewares/auth', () => ({
	verifyToken: (req: express.Request, res: express.Response, next: NextFunction) => {
	 req.user = { uid: 'master' };
	 next();
	}
}));

const app = express();
app.use(express.json());
app.use(voteRoutes);

describe('Vote Routes', () => {
	it('GET /votes/:id returns vote count for valid ID', async () => {
		const res = await request(app).get('/votes/1');
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('votes', 5);
	});

	it('GET /votes/:id returns 404 for invalid ID', async () => {
		const res = await request(app).get('/votes/999');
		expect(res.statusCode).toBe(404);
		expect(res.body).toHaveProperty('error');
	});

	it('POST /votes/:id records a vote for valid user', async () => {
		const res = await request(app)
			.post('/votes/1')
			.set('Authorization', 'Bearer testtoken');
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('message');
	});

	it('POST /votes/:id returns 404 for invalid ID', async () => {
		const res = await request(app)
			.post('/votes/999')
			.set('Authorization', 'Bearer testtoken');
		expect(res.statusCode).toBe(404);
		expect(res.body).toHaveProperty('error');
	});

	it('GET /proposals returns proposals for authenticated user', async () => {
		const res = await request(app)
			.get('/proposals')
			.set('Authorization', 'Bearer testtoken');
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body[0]).toHaveProperty('name', 'Test Proposal');
	});

	it('POST /proposals creates a new proposal', async () => {
		const res = await request(app)
			.post('/proposals')
			.send({ name: 'New Proposal', logo: 'logo.png', group: 'Group' });
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('message', 'Proposal created successfully');
		expect(res.body).toHaveProperty('proposalId', 123);
	});
});
