// Types for /votes/:id GET response
export interface GetVoteByIdResponse {
  votes: number;
}

// Types for /votes/:id POST response
export interface VoteRecordedResponse {
  message: string;
}

export interface VoteErrorResponse {
  error: string;
}

// Types for /proposals GET response
export interface Proposal {
  id: number;
  name: string;
  logo: string;
  group: string;
  votes: number;
}

export type GetAllProposalsResponse = Proposal[];

// Types for /proposals POST request and response
export interface CreateProposalRequest {
  name: string;
  logo: string;
  group: string;
}

export interface CreateProposalResponse {
  message: string;
  proposalId: number;
}