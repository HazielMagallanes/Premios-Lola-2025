import { useState } from 'react';
import { useApi } from '../hooks/useApi';

/**
 * Form for voting for a proposal
 */
export default function VoteForm() {
  const [proposalId, setProposalId] = useState('');
  const { data, loading, error, fetchData } = useApi<{ message: string }>(`/votes/${proposalId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  function handleVote(e: React.FormEvent) {
    e.preventDefault();
    fetchData();
  }

  return (
    <form onSubmit={handleVote}>
      <label>
        Proposal ID:
        <input value={proposalId} onChange={e => setProposalId(e.target.value)} required />
      </label>
      <button type="submit" disabled={loading}>Vote</button>
      {error && <p>Error: {error}</p>}
      {data && <p>{data.message}</p>}
    </form>
  );
}
