import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Apple, Boxes, Lightbulb, ShoppingCart, BarChart2, Settings, LogOut, Search, Star, MessageCircle, ShoppingBag } from 'lucide-react';
import { ACCESS_TOKEN } from '../constants';
import '../styles/Proveedores.css';

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [currentPage, setCurrentPage] = useState('/proveedores');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchUbicacion, setSearchUbicacion] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
      console.error('No hay token disponible');
      navigate('/login');
      return;
    }

    fetch('http://localhost:8000/api/employees/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch proveedores');
        }
        return response.json();
      })
      .then((data) => {
        setProveedores(data);
        setFilteredProveedores(data);
      })
      .catch((error) => {
        console.error('Error fetching proveedores:', error);
      });

    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);
  }, [navigate]);

  useEffect(() => {
    let results = proveedores;

    if (searchTerm) {
      results = results.filter(proveedor =>
        proveedor.user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (searchUbicacion) {
      results = results.filter(proveedor =>
        proveedor.profile.ubicacion && proveedor.profile.ubicacion.toLowerCase().includes(searchUbicacion.toLowerCase())
      );
    }

    if (sortOrder === 'asc') {
      results = results.sort((a, b) => a.promedio_calificacion - b.promedio_calificacion);
    } else if (sortOrder === 'desc') {
      results = results.sort((a, b) => b.promedio_calificacion - a.promedio_calificacion);
    }

    setFilteredProveedores(results);
  }, [searchTerm, searchUbicacion, sortOrder, proveedores]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchUbicacion = (event) => {
    setSearchUbicacion(event.target.value);
  };

  const handleSortOrder = (event) => {
    setSortOrder(event.target.value);
  };

  const handleVerCarrito = () => {
    navigate('/carrito');
  };

  const handleNavigation = (path) => {
    setCurrentPage(path);
    navigate(path);
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
    <div className="proveedores-home-container">
      <aside className="proveedores-sidebar">
        <div className="proveedores-logo-container">
          <h1 className="proveedores-logo">Stocket</h1>
        </div>
        
        <nav className="proveedores-sidebar-nav">
          {sidebarSections.map((section, index) => (
            <div key={index} className="proveedores-nav-section">
              <h2 className="proveedores-nav-section-title">{section.title}</h2>
              {section.items.map((item) => (
                <button
                  key={item.name}
                  className={`proveedores-nav-item ${currentPage === item.path ? 'proveedores-active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="proveedores-nav-icon" />
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="proveedores-main-content">
        <header className="proveedores-navbar">
          <div className="proveedores-navbar-container">
            <h1 className="proveedores-navbar-title">
            </h1>
            <div className="proveedores-navbar-actions">
              <button className="proveedores-navbar-button">
                <MessageCircle className="proveedores-navbar-icon" onClick={() => navigate("/chat")} />
              </button>
              <button className="proveedores-navbar-button" onClick={handleVerCarrito}>
                <ShoppingBag className="proveedores-navbar-icon" />
              </button>
            </div>
          </div>
        </header>

        <main className="proveedores-page-content">
          <div className="proveedores-content-container">
            <h2 className="proveedores-title">Explorar Proveedores</h2>
            <div className="proveedores-filters">
              <div className="proveedores-search-container">
                <Search className="proveedores-search-icon" />
                <input
                  type="text"
                  placeholder="Buscar proveedores por nombre..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="proveedores-search-input"
                />
              </div>
              <div className="proveedores-search-container">
                <Search className="proveedores-search-icon" />
                <input
                  type="text"
                  placeholder="Buscar proveedores por ubicación..."
                  value={searchUbicacion}
                  onChange={handleSearchUbicacion}
                  className="proveedores-search-input"
                />
              </div>
              <select
                value={sortOrder}
                onChange={handleSortOrder}
                className="proveedores-sort-select"
              >
                <option value="">Ordenar por calificación...</option>
                <option value="asc">Calificación: Mayor a Menor</option>
                <option value="desc">Calificación: Menor a Mayor</option>
              </select>
            </div>
            <div className="proveedores-grid">
              {filteredProveedores.length > 0 ? (
                filteredProveedores.map((proveedor, index) => (
                  <div key={index} className="proveedor-card">
                    <div className="proveedor-card-content">
                      {proveedor.profile.foto ? (
                        <img
                          src={`http://localhost:8000${proveedor.profile.foto}`}
                          alt={`Foto de ${proveedor.user.username}`}
                          className="proveedor-photo"
                        />
                      ) : (
                        <div className="proveedor-photo-placeholder">
                          Sin Foto
                        </div>
                      )}
                      <h3 className="proveedor-nombre">{proveedor.user.username}</h3>
                      <p className="proveedor-email">Email: {proveedor.user.email}</p>
                      <p className="proveedor-ubicacion">Ubicación: {proveedor.profile.ubicacion || 'No especificada'}</p>
                      <div className="proveedor-calificación">
                        <p>Calificación:</p>
                        <div className="estrellas">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`estrella ${star <= Math.round(proveedor.promedio_calificacion) ? 'filled' : ''}`}
                            />
                          ))}
                        </div>
                        <span>
                          {proveedor.promedio_calificacion > 0
                            ? `${proveedor.promedio_calificacion.toFixed(1)} / 5`
                            : 'No calificado'}
                        </span>
                      </div>
                      <button
                        className="proveedor-boton-ver"
                        onClick={() => navigate(`/perfil/${proveedor.user.id}`)}
                      >
                        Ver Perfil
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-proveedores">No hay proveedores disponibles.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}