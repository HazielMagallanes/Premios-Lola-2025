import { ProposalCreateDto } from '../models/validation.dto';
import { ValidationMiddleware } from '../config/validation';

export const proposalCreateMiddleware = ValidationMiddleware(ProposalCreateDto, false, true, true);