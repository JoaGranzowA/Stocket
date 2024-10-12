import "../styles/NotFound.css"

function NotFound() {
  return (
    <div className="error-container">
      <div className="error-card">
        <h1>404</h1>
        <div className="title-underline"></div>
        <h2>Página no encontrada</h2>
        <p>Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
        <button className="home-button" onClick={() => window.location.href = '/'}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default NotFound