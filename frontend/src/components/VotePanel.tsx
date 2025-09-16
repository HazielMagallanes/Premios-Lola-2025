import { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import type { User } from "firebase/auth";
import LoadingScreen from './Loading';
import banner from '../assets/images/banner.webp';
import googleIcon from "../assets/images/google.svg";
import logo from "../assets/images/logo.png";

// ===== API Types =====
import type { Vote, UserStatus, ProposalResponse } from '../types/api';
import { useParams } from 'react-router-dom';

// ====== Helpers ======
function areCookiesEnabled(): boolean {
  document.cookie = "testcookie=1";
  const cookiesEnabled = document.cookie.indexOf("testcookie") !== -1;
  document.cookie = "testcookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  return cookiesEnabled;
}

// ====== Component ======
function VotePanel() {
  const [movies, setMovies] = useState<Vote[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const { groupStr } = useParams<{ groupStr: string }>();
  const group = !isNaN(Number(groupStr)) ? Number(groupStr) : 1; // Default to 1 if no group is specified
  const server = import.meta.env.VITE_API_URL;
  const voteMasterUID = import.meta.env.VITE_VOTE_MASTER;

  // ====== Auth listener ======
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        fetchMovies(currentUser);
        checkUserVoteStatus(currentUser);
      }
    });
    return () => unsubscribe();
  });

  // ====== Fetch Proposals ======
  const fetchMovies = async (currentUser: User) => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${server}/proposals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('ERROR: Failed to fetch, response was not OK');

      const data: Vote[] = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  // ====== Check Vote Status ======
  const checkUserVoteStatus = async (currentUser: User) => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${server}/user-vote-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch user vote status');

      const data: UserStatus = await response.json();
      if (currentUser.uid !== voteMasterUID) {
        setHasVoted(data.hasVoted);
      }
    } catch (error) {
      console.error('Error checking user vote status:', error);
    }
  };

  // ====== Sign in with Google ======
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      fetchMovies(result.user);
      checkUserVoteStatus(result.user);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  // ====== Handle Vote ======
  const handleVote = async (id: number) => {
    if (!user) {
      alert("¡Debes iniciar sesión para votar!");
      return;
    }

    checkUserVoteStatus(user);

    if (!areCookiesEnabled()) {
      alert("Debes tener las cookies habilitadas para votar.");
      return;
    }

    if (hasVoted) {
      alert("Ya has votado. No puedes votar más de una vez.");
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${server}/votes/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': "application/json",
        },
        body: JSON.stringify({ userId: user.uid }),
      });

      const data: ProposalResponse & { error?: string } = await response.json();

      if (data.error) {
        alert("Ocurrió un error votando, informa a los organizadores. \n" + data.error);
      } else {
        console.log(data.message);
        alert("Voto emitido con éxito.");
        setHasVoted(true);
      }
    } catch (error: any) {
      console.error("Error sending votes:", error);
      alert("Ocurrió un error votando, informa a los organizadores. \n" + error.message);
    }
  };

  // ====== Loading screen ======
  if (loading) {
    return <LoadingScreen />;
  }

  // ====== Render App ======
  return (
    <main className="container">
      {!user ? (
        <section aria-labelledby="auth-title">
          <div className='login-form' role="region" aria-label="Inicio de sesión">
            <div className='logo-container'><img src={logo} alt='Lola Cine Logo' /></div>
            <h1 id="auth-title">Inicia Sesión</h1>
            <button className='signin' onClick={handleLogin} aria-label="Iniciar sesión con Google">
              <div className='logo-container'><img src={googleIcon} alt='Google' /></div>
              <span className='login-button-text'>Iniciar sesión con Google</span>
            </button>
          </div>
        </section>
      ) : (
        <>
          <header className="banner" role="banner">
            <img src={banner} alt="Banner" />
          </header>
          <section className="vote-grid" aria-label="Listado de propuestas">
            {movies
              .filter((movie) => movie.group == group)
              .map((movie) => (
                <article key={movie.ID} className="movie" aria-label={`Propuesta: ${movie.name}`}>
                  <div className="content">
                    <h3 className="title">{movie.name}</h3>
                    <span className='school'>{movie.school}</span>
                  </div>
                  <button onClick={() => handleVote(movie.ID)} disabled={hasVoted} aria-label={`Votar por ${movie.name}`}>
                    {hasVoted ? "Ya votaste" : "Votar"}
                  </button>
                </article>
              ))}
          </section>
        </>
      )}
    </main>
  );
}

export default VotePanel;
