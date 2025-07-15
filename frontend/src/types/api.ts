// TypeScript types for backend API responses
export interface Vote {
  ID: number;
  school: string;
  name: string;
  logo: string;
  votes: number;
  group: number;
}

export interface UserStatus {
  hasVoted: boolean;
}

export interface AdminStatus {
  isAdmin: boolean;
}

export interface State {
  enabled: boolean;
}

export interface ProposalResponse {
  message: string;
  proposalId: number;
}
