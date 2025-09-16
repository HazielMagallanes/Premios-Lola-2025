/**
 * 404 Not Found page for SPA
 */
export default function NotFound() {
  return (
    <main className="container" role="main">
      <section className="notfound" aria-live="polite">
        <h1>404</h1>
        <p>Página no encontrada.</p>
        <a href="/" className="link-home" aria-label="Ir a inicio">Volver al inicio</a>
      </section>
    </main>
  );
}
