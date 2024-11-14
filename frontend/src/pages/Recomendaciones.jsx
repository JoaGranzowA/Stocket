import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Apple, Lightbulb, ShoppingCart, BarChart2, Settings, LogOut, MessageCircle, ShoppingBag } from 'lucide-react';
import { ACCESS_TOKEN } from '../constants';
import '../styles/Recomendaciones.css';

export default function Recomendaciones() {
  const [masComprados, setMasComprados] = useState([]);
  const [proveedoresHabituales, setProveedoresHabituales] = useState([]);
  const [currentPage, setCurrentPage] = useState('/recomendaciones');
  const [carrito, setCarrito] = useState([]);
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

    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);
  }, [navigate]);

  const handleNavigation = (path) => {
    setCurrentPage(path);
    navigate(path);
  };

  const handleVerCarrito = () => {
    navigate('/carrito');
  };

  const sidebarSections = [
    {
      title: "Panel de Control",
      items: [
        { name: 'Panel Principal', icon: Home, path: '/vendedor/home' },
        { name: 'Catálogo de Productos', icon: Apple, path: '/productos' },
        { name: 'Nuestros Proveedores', icon: Users, path: '/proveedores' },
      ]
    },
    {
      title: "Gestión y Operaciones",
      items: [
        { name: 'Mis Pedidos', icon: ShoppingCart, path: '/pedidos' },
        { name: 'Reportes de Ventas', icon: BarChart2, path: '/analisis' },
        { name: 'Recomendaciones', icon: Lightbulb, path: '/recomendaciones' },
      ]
    },
    {
      title: "Configuración",
      items: [
        { name: 'Ajustes de Perfil', icon: Settings, path: '/perfil' },
        { name: 'Cerrar sesión', icon: LogOut, path: '/logout' },
      ]
    }
  ];

  return (
    <div className="recomendaciones-home-container">
      <aside className="recomendaciones-sidebar">
        <div className="recomendaciones-logo-container">
          <h1 className="recomendaciones-logo">Stocket</h1>
        </div>

        <nav className="recomendaciones-sidebar-nav">
          {sidebarSections.map((section, index) => (
            <div key={index} className="recomendaciones-nav-section">
              <h2 className="recomendaciones-nav-section-title">{section.title}</h2>
              {section.items.map((item) => (
                <button
                  key={item.name}
                  className={`recomendaciones-nav-item ${currentPage === item.path ? 'recomendaciones-active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="recomendaciones-nav-icon" />
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="recomendaciones-main-content">
        <header className="recomendaciones-navbar">
          <div className="recomendaciones-navbar-container">
            <h1 className="recomendaciones-navbar-title"></h1>
            <div className="recomendaciones-navbar-actions">
              <button className="recomendaciones-navbar-button" onClick={() => navigate("/chat")}>
                <MessageCircle className="recomendaciones-navbar-icon" />
              </button>
              <button className="recomendaciones-navbar-button" onClick={handleVerCarrito}>
                <ShoppingBag className="recomendaciones-navbar-icon" />
              </button>
            </div>
          </div>
        </header>

        <main className="recomendaciones-page-content">
          <div className="recomendaciones-content-container">
            <section className="recomendaciones-section">
              <h2>Más Comprados por la App</h2>
              <div className="recomendaciones-productos-grid">
                {masComprados.length > 0 ? (
                  masComprados.map((producto) => (
                    <div key={producto.id} className="recomendaciones-producto-card">
                      {producto.imagen && (
                        <img
                          src={`http://localhost:8000${producto.imagen}`}
                          alt={producto.titulo}
                          className="recomendaciones-producto-imagen"
                          onClick={() => navigate(`/producto/${producto.id}`)}
                        />
                      )}
                      <div className="recomendaciones-producto-content">
                        <h3 className="recomendaciones-producto-titulo">{producto.titulo}</h3>
                        <p className="recomendaciones-producto-precio">Precio: ${producto.precio}</p>
                        <button
                          className="recomendaciones-producto-boton"
                          onClick={() => navigate(`/producto/${producto.id}`)}
                        >
                          Ver Producto
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No hay productos recomendados.</p>
                )}
              </div>
            </section>

            <section className="recomendaciones-section">
              <h2>De Tus Proveedores Habituales</h2>
              <div className="recomendaciones-productos-grid">
                {proveedoresHabituales.length > 0 ? (
                  proveedoresHabituales.map((producto) => (
                    <div key={producto.id} className="recomendaciones-producto-card">
                      {producto.imagen && (
                        <img
                          src={`http://localhost:8000${producto.imagen}`}
                          alt={producto.titulo}
                          className="recomendaciones-producto-imagen"
                          onClick={() => navigate(`/producto/${producto.id}`)}
                        />
                      )}
                      <div className="recomendaciones-producto-content">
                        <h3 className="recomendaciones-producto-titulo">{producto.titulo}</h3>
                        <p className="recomendaciones-producto-precio">Precio: ${producto.precio}</p>
                        <button
                          className="recomendaciones-producto-boton"
                          onClick={() => navigate(`/producto/${producto.id}`)}
                        >
                          Ver Producto
                        </button>
                      </div>
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
