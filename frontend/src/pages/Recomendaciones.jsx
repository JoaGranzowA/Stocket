import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Apple, Boxes, Lightbulb, ShoppingCart, BarChart2, Settings, LogOut } from 'lucide-react';
import { ACCESS_TOKEN } from '../constants';
import '../styles/Recomendaciones.css';

export default function Recomendaciones() {
  const [masComprados, setMasComprados] = useState([]);
  const [proveedoresHabituales, setProveedoresHabituales] = useState([]);
  const [currentPage, setCurrentPage] = useState('/recomendaciones');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error('No hay token disponible');
      navigate('/login');
      return;
    }

    // Fetch para obtener los productos más comprados
    fetch('http://localhost:8000/api/recomendaciones/mas-comprados/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch mas comprados');
        }
        return response.json();
      })
      .then((data) => setMasComprados(data))
      .catch((error) => console.error('Error fetching mas comprados:', error));

    // Fetch para obtener productos de los proveedores habituales
    fetch('http://localhost:8000/api/recomendaciones/proveedores-habituales/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch proveedores habituales');
        }
        return response.json();
      })
      .then((data) => setProveedoresHabituales(data))
      .catch((error) => console.error('Error fetching proveedores habituales:', error));
  }, [navigate]);

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

  return (
    <div className="home-container">
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
            <h1 className="navbar-title">Recomendaciones</h1>
          </div>
        </header>
        <main className="page-content">
          <div className="recomendaciones-container">
            <section className="recomendaciones-section">
              <h2>Más Comprados por la App</h2>
              <div className="productos-grid">
                {masComprados.length > 0 ? (
                  masComprados.map((producto) => (
                    <div key={producto.id} className="producto-card">
                      {producto.imagen && (
                        <img
                          src={`http://localhost:8000${producto.imagen}`}
                          alt={producto.titulo}
                          className="producto-imagen"
                        />
                      )}
                      <h3>{producto.titulo}</h3>
                      <p>Precio: ${producto.precio}</p>
                      <button onClick={() => navigate(`/productos/${producto.id}`)}>Ver Producto</button>
                    </div>
                  ))
                ) : (
                  <p>No hay productos recomendados.</p>
                )}
              </div>
            </section>

            <section className="recomendaciones-section">
              <h2>De Tus Proveedores Habituales</h2>
              <div className="productos-grid">
                {proveedoresHabituales.length > 0 ? (
                  proveedoresHabituales.map((producto) => (
                    <div key={producto.id} className="producto-card">
                      {producto.imagen && (
                        <img
                          src={`http://localhost:8000${producto.imagen}`}
                          alt={producto.titulo}
                          className="producto-imagen"
                        />
                      )}
                      <h3>{producto.titulo}</h3>
                      <p>Precio: ${producto.precio}</p>
                      <button onClick={() => navigate(`/productos/${producto.id}`)}>Ver Producto</button>
                    </div>
                  ))
                ) : (
                  <p>No hay productos recomendados de tus proveedores habituales.</p>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}


