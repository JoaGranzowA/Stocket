import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Apple, Users, ShoppingCart, BarChart2, Lightbulb, Settings, LogOut, MessageCircle, ShoppingBag, Search } from 'lucide-react';
import { ACCESS_TOKEN } from '../constants';
import "../styles/Productos.css";

export default function ProductosClientes() {
  const [currentPage, setCurrentPage] = useState('/productos');
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    fetch('http://localhost:8000/api/productos-disponibles/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }
        return response.json();
      })
      .then((data) => setProductos(data))
      .catch((error) => console.error('Error al cargar productos:', error));

    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);
  }, []);

  const handleVerCarrito = () => {
    navigate('/carrito');
  };

  const handleNavigation = (path) => {
    setCurrentPage(path);
    navigate(path);
  };

  const handleVerProducto = (productoId) => {
    navigate(`/producto/${productoId}`);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (event) => {
    setSortOrder(event.target.value);
  };

  const filteredAndSortedProducts = productos
    .filter(producto => 
      producto.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.precio - b.precio;
      } else {
        return b.precio - a.precio;
      }
    });

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
    <div className="productos-home-container">
      <aside className="productos-sidebar">
        <div className="productos-logo-container">
          <h1 className="productos-logo">Stocket</h1>
        </div>
        
        <nav className="productos-sidebar-nav">
          {sidebarSections.map((section, index) => (
            <div key={index} className="productos-nav-section">
              <h2 className="productos-nav-section-title">{section.title}</h2>
              {section.items.map((item) => (
                <button
                  key={item.name}
                  className={`productos-nav-item ${currentPage === item.path ? 'productos-active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="productos-nav-icon" />
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="productos-main-content">
        <header className="productos-navbar">
          <div className="productos-navbar-container">
            <h1 className="productos-navbar-title"></h1>
            <div className="productos-navbar-actions">
              <button className="productos-navbar-button" onClick={() => navigate("/chat")}>
                <MessageCircle className="productos-navbar-icon" />
              </button>
              <button className="productos-navbar-button" onClick={handleVerCarrito}>
                <ShoppingBag className="productos-navbar-icon" />
                <span className="productos-carrito-count">{carrito.length}</span>
              </button>
            </div>
          </div>
        </header>

        <main className="productos-page-content">
          <div className="productos-content-container">
            <h2 className="productos-title">Explorar Productos</h2>
            <div className="productos-filters">
              <div className="productos-search-container">
                <Search className="productos-search-icon" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="productos-search-input"
                />
              </div>
              <select
                value={sortOrder}
                onChange={handleSort}
                className="productos-sort-select"
              >
                <option value="asc">Precio: Menor a Mayor</option>
                <option value="desc">Precio: Mayor a Menor</option>
              </select>
            </div>
            <div className="productos-grid">
              {filteredAndSortedProducts.map((producto) => (
                <div key={producto.id} className="productos-card">
                  {producto.imagen && (
                    <img
                      src={`http://localhost:8000${producto.imagen}`}
                      alt={producto.titulo}
                      className="productos-imagen"
                      onClick={() => handleVerProducto(producto.id)}
                    />
                  )}
                  <div className="productos-card-content">
                    <h3 className="productos-nombre">{producto.titulo}</h3>
                    <p className="productos-precio">Precio: ${producto.precio.toFixed(2)}</p>
                    <p className="productos-vendedor">Vendedor: {producto.vendedor}</p>
                    <button
                      className="productos-boton-agregar-carrito"
                      onClick={() => handleVerProducto(producto.id)}
                    >
                      Ver Producto
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}