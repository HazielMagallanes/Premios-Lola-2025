import { useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import type { Vote } from '../types/api';

/**
 * Displays all proposals and their vote counts
 */
export default function Proposals() {
  const { data, loading, error, fetchData } = useApi<Vote[]>('/proposals');

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <p>Loading proposals...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return null;

  return (
    <section>
      <h2>Proposals</h2>
      <ul>
        {data.map((proposal) => (
          <li key={proposal.ID}>
            <img src={proposal.logo} alt={proposal.name} width={48} />
            <strong>{proposal.name}</strong> ({proposal.school}) - Votes: {proposal.votes}
          </li>
        ))}
      </ul>
    </section>
  );
}
