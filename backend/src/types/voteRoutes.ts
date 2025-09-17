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
  ID: number;
  school: string;
  name: string;
  logo: string;
  votes: number;
  group: number;
}

export type GetAllProposalsResponse = Proposal[];

// Types for /proposals POST request and response
export interface CreateProposalRequest {
  school: string;
  name: string;
  logo: string;
  group: string;
}

export interface CreateProposalResponse {
  message: string;
  proposalId: number;
}