import { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import type { User } from "firebase/auth";
import LoadingScreen from './Loading';
import googleIcon from "../assets/images/google.svg";
import logo from "../assets/images/logo.png";
import type { Vote, AdminStatus } from '../types/api'; 
import { useNavigate } from 'react-router-dom';


function AdminPanel() {
  const [movies, setMovies] = useState<Vote[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  const server = import.meta.env.VITE_API_URL as string;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        fetchMovies(currentUser);
        userIsAdmin(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchMovies = async (currentUser: User) => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${server}/proposals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('ERROR: Failed to fetch, response was not OK');
      }

      const data: Vote[] = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  const userIsAdmin = async (currentUser: User) => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${server}/user-is-admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('ERROR: Failed to fetch, response was not OK');
      }

      const data: AdminStatus = await response.json();
      setIsAdmin(data.isAdmin);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const changeVotingState = async (newState: boolean) => {
    try {
      const endpoint = newState ? '/enable-votes' : '/disable-votes';
      const response = await fetch(`${server}${endpoint}`);

      if (!response.ok) {
        throw new Error('ERROR: Failed to update voting state');
      }

      const data = await response.json();
      if (data.error) {
        alert("Algo salió mal.");
      } else {
        alert(newState ? "Votación habilitada." : "Votación deshabilitada.");
      }
    } catch (error) {
      console.error('Error updating voting state:', error);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      fetchMovies(result.user);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container">
      {!user ? (
        <div>
          <div className='login-form'>
            <div className='logo-container'><img src={logo} alt='Lola Cine Logo' /></div>
            <h1>Inicia Sesión</h1>
            <button className='signin' onClick={handleLogin}>
              <div className='logo-container'><img src={googleIcon} alt='Google icon' /></div>
              <span className='login-button-text'>Iniciar sesión con Google</span>
            </button>
          </div>
        </div>
      ) : !isAdmin ? (
        <div className='no-access'>
          <span>No tienes acceso a esta página.</span>
          <span onClick={() => {navigate(-1)}}>Volver.</span>
        </div>
      ) : (
        <div className='admin-panel'>
          <div className='panel-buttons'>
            <button onClick={() => changeVotingState(true)}>Habilitar votación</button>
            <button onClick={() => changeVotingState(false)}>Deshabilitar votación</button>
          </div>
          <div className='proposal-list'>
            <table>
              <thead>
                <tr className='column-names'>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Escuela</th>
                  <th>Grupo</th>
                  <th>Votos</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie.ID}>
                    <td>{movie.ID}</td>
                    <td>{movie.name}</td>
                    <td>{movie.school}</td>
                    <td>{movie.group}</td>
                    <td>{movie.votes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
