import { useEffect, useState } from 'react';
import LoadingScreen from './Loading';
import logo from "../assets/images/logo.png";
import type { Vote } from '../types/api'; 


function AdminPanel() {
  const [movies, setMovies] = useState<Vote[]>([]);
  const [token, setToken] = useState<string>('');
  const [loading] = useState<boolean>(false);

  const server = import.meta.env.VITE_API_URL as string;

  useEffect(() => { 
    if (token.length > 0) {
      fetchMoviesAdmin();
    }
  }, [token]);

  // ====== Fetch Proposals ======

  const fetchMoviesAdmin = async () => {
    try {
      const response = await fetch(`${server}/admin/proposals`, {
        method: "GET",
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

  const changeVotingState = async (newState: boolean, group: number) => {
    try {
      const endpoint = newState ? '/enable-votes' : '/disable-votes';
      const response = await fetch(`${server}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ group }),
      });

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
    const tokenInput = (document.querySelector('input[aria-label="Token de administrador"]') as HTMLInputElement).value;
    if (!tokenInput) {
      alert("Por favor ingresa el token.");
      return;
    }

    try {
      const response = await fetch(`${server}/admin-test`, {
        headers: {
          Authorization: `Bearer ${tokenInput}`
        }
      });

      if (!response.ok) {
        alert("Token inválido o error en la autenticación.");
      } else {
        setToken(tokenInput);
        fetchMoviesAdmin();
      }

      
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main className="container">
      {token.length == 0 ? (
        <section aria-labelledby="admin-auth-title">
          <div className='login-form' role="region" aria-label="Inicio de sesión">
            <div className='logo-container'><img src={logo} alt='Lola Cine Logo' /></div>
            <h1 id="admin-auth-title">Ingrese el token</h1>
            <p className="helper-text" id="admin-token-help">Acceso exclusivo para administradores del evento.</p>
            <input className="token-input" type="text" placeholder="Token de administrador" aria-label="Token de administrador" aria-describedby="admin-token-help" />
            <button className='signin' onClick={handleLogin} aria-label="Iniciar sesión con Google">
              <span className='login-button-text'>Ingresar</span>
            </button>
          </div>
        </section>
      ) : (
        <section className='admin-panel' aria-labelledby="panel-title">
          <header className="admin-header" role="banner">
            <div className='logo-container small'><img src={logo} alt='Lola Cine Logo' /></div>
            <p className="panel-subtitle">Control de votaciones por grupo</p>
          </header>
          <h1 id="panel-title" className="panel-title">Panel de Administración</h1>
          <div className="groups-grid" role="group" aria-label="Controles por grupo">
            {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className='panel-buttons'>
              <span className='group-label'>Grupo {i}:</span>
              <button className="button-1" onClick={() => changeVotingState(true, i)}>Habilitar votación</button>
              <button className="button-2" onClick={() => changeVotingState(false, i)}>Deshabilitar votación</button>
            </div>
            ))}
          </div>
          <div className='proposal-list'>
            <div className='table-wrapper'>
              <table>
              <caption className="table-caption">Propuestas registradas</caption>
              <thead>
                <tr className='column-names'>
                  <th scope="col">ID</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Escuela</th>
                  <th scope="col">Grupo</th>
                  <th scope="col">Votos</th>
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
        </section>
      )}
    </main>
  );
}

export default AdminPanel;
