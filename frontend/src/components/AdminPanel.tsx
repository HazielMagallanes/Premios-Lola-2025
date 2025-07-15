import { useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import type { AdminStatus } from '../types/api';

/**
 * Admin panel for enabling/disabling voting
 */
export default function AdminPanel() {
  const { data, loading, error, fetchData } = useApi<AdminStatus>('/user-is-admin');

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <p>Checking admin status...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data?.isAdmin) return <p>Access denied. You are not an admin.</p>;

  return (
    <section>
      <h2>Admin Panel</h2>
      <button onClick={() => fetch('/enable-votes').then(() => window.location.reload())}>Enable Voting</button>
      <button onClick={() => fetch('/disable-votes').then(() => window.location.reload())}>Disable Voting</button>
    </section>
  );
}
