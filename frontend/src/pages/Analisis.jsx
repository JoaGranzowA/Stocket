import React, { useState } from 'react';
import { Home, Users, Apple, Lightbulb, ShoppingCart, BarChart2, Settings, MessageCircle, ShoppingBag, LogOut, Boxes } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function DatosPage() {
  const [currentPage, setCurrentPage] = useState('/analisis');
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate('/chat');
  };

  const navItems = [
    { name: 'Inicio', icon: Home, path: '/vendedor/home' },
    { name: 'Productos', icon: Apple, path: '/productos' },
    { name: 'Proveedores', icon: Users, path: '/proveedores' },
    { name: 'Recomendaciones', icon: Lightbulb, path: '/recomendaciones' },
    { name: 'Pedidos', icon: ShoppingCart, path: '/pedidos' },
    { name: 'Mi Stock', icon: Boxes, path: '/stock' },
    { name: 'Análisis', icon: BarChart2, path: '/analisis' },
    { name: 'Configuración', icon: Settings, path: '/perfil' },
    { name: 'Cerrar sesión', icon: LogOut, path: '/logout' },
  ];

  const estadisticas = [
    {
      titulo: 'Productos Más Vendidos',
      datos: [
        { nombre: 'Camiseta Básica', cantidad: 500, ganancia: 5000 },
        { nombre: 'Jeans Clásicos', cantidad: 300, ganancia: 6000 },
        { nombre: 'Zapatillas Deportivas', cantidad: 200, ganancia: 8000 },
      ]
    },
    {
      titulo: 'Productos con Mayor Ganancia',
      datos: [
        { nombre: 'Chaqueta de Cuero', cantidad: 100, ganancia: 10000 },
        { nombre: 'Vestido de Gala', cantidad: 50, ganancia: 7500 },
        { nombre: 'Reloj de Lujo', cantidad: 25, ganancia: 6250 },
      ]
    },
    {
      titulo: 'Productos con Pérdidas',
      datos: [
        { nombre: 'Calcetines de Temporada', cantidad: 1000, perdida: 500 },
        { nombre: 'Gorras Promocionales', cantidad: 500, perdida: 250 },
        { nombre: 'Llaveros Personalizados', cantidad: 2000, perdida: 100 },
      ]
    },
  ];

  return (
    <div className="home-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-container">
          <h1 className="logo">Stocket</h1>
        </div>
       <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${currentPage === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="nav-icon" />
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      <div className="main-content">
        <header className="navbar">
          <div className="navbar-container">
          <h1 className="navbar-title">Análisis de Ventas</h1>
            <div className="navbar-actions">
              <button className="navbar-button">
                <MessageCircle className="navbar-icon" onClick={handleChatClick} />
              </button>
              <button className="navbar-button">
                <ShoppingBag className="navbar-icon" />
              </button>
            </div>
          </div>
        </header>
    
        

        <main className="page-content">
          <div className="content-container">
            <h2 className="section-title">Resumen de Ventas y Ganancias</h2>
            <div className="estadisticas-grid">
              {estadisticas.map((categoria, index) => (
                <div key={index} className="categoria-card">
                  <h3 className="categoria-titulo">{categoria.titulo}</h3>
                  <table className="datos-tabla">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>{categoria.titulo.includes('Pérdidas') ? 'Pérdida' : 'Ganancia'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoria.datos.map((producto, prodIndex) => (
                        <tr key={prodIndex}>
                          <td>{producto.nombre}</td>
                          <td>{producto.cantidad}</td>
                          <td className={producto.perdida ? 'perdida' : 'ganancia'}>
                            ${(producto.ganancia || producto.perdida).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .home-container {
          display: flex;
          height: 100vh;
          background-color: #f0f0f0;
          font-family: Arial, sans-serif;
        }

        .sidebar {
          width: 250px;
          background-color: white;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }

        .logo-container {
          padding: 1rem;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: #8B5CF6;
          margin: 0;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          padding-top: 1rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          color: #4B5563;
          text-decoration: none;
          transition: background-color 0.3s, color 0.3s;
          border: none;
          background: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          font-size: 1rem;
        }

        .nav-item:hover {
          background-color: #F3E8FF;
          color: #8B5CF6;
        }

        .nav-item.active {
          background-color: #F3E8FF;
          color: #8B5CF6;
          font-weight: 600;
        }

        .nav-icon {
          width: 1.25rem;
          height: 1.25rem;
          margin-right: 0.75rem;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .navbar {
          background-color: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1.5rem;
        }

        .navbar-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1F2937;
          text-decoration: none;
        }

        .navbar-actions {
          display: flex;
          gap: 1rem;
        }

        .navbar-button {
          background: none;
          border: none;
          cursor: pointer;
          color: #4B5563;
          transition: color 0.3s;
        }

        .navbar-button:hover {
          color: #8B5CF6;
        }

        .navbar-icon {
          width: 1.5rem;
          height: 1.5rem;
        }

        .page-content {
          flex: 1;
          overflow-x: hidden;
          overflow-y: auto;
          background-color: #f0f0f0;
        }

        .content-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .section-title {
          font-size: 1.875rem;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 1.5rem;
        }

        .estadisticas-grid {
          display: grid;
          gap: 2rem;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }

        .categoria-card {
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
        }

        .categoria-titulo {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 1rem;
        }

        .datos-tabla {
          width: 100%;
          border-collapse: collapse;
        }

        .datos-tabla th,
        .datos-tabla td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #E5E7EB;
        }

        .datos-tabla th {
          background-color: #F3F4F6;
          font-weight: 600;
          color: #4B5563;
        }

        .datos-tabla tr:last-child td {
          border-bottom: none;
        }

        .ganancia {
          color: #10B981;
        }

        .perdida {
          color: #EF4444;
        }
      `}</style>
    </div>
  );
}