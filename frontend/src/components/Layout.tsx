import type { ReactNode } from 'react';

/**
 * Main layout wrapper for the SPA
 */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app-layout">
      <header>
        <h1>LolaCine Voting System</h1>
      </header>
      <main>{children}</main>
      <footer>
        <small>&copy; 2025 LolaCine</small>
      </footer>
    </div>
  );
}
