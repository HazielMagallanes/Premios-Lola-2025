import { EnableVotesDto } from '../models/validation.dto';
import { ValidationMiddleware } from '../config/validation';

export const enableVotesMiddleware = ValidationMiddleware(EnableVotesDto, false, true, true);