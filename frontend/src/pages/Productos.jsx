import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home,Users, Package, Lightbulb, ShoppingCart, BarChart2, ShoppingBag, Settings, MessageCircle, LogOut, Plus, AlertTriangle } from 'lucide-react';
import { ACCESS_TOKEN } from '../constants';
import "../styles/Productos.css";

export default function ProductosClientes() {
  const [currentPage, setCurrentPage] = useState('/productos');
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
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

  const handleAgregarAlCarrito = (producto) => {
    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
    const existe = carritoActual.find((item) => item.id === producto.id);
    let nuevoCarrito;
    if (existe) {
      nuevoCarrito = carritoActual.map((item) =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
    } else {
      nuevoCarrito = [...carritoActual, { ...producto, cantidad: 1 }];
    }
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  const handleVerCarrito = () => {
    navigate('/carrito');
  };

  const handleNavigation = (path) => {
    setCurrentPage(path);
    console.log(`Navigating to ${path}`);
  };

  const navItems = [
    { name: 'Inicio', icon: Home, path: '/vendedor/home' },
    { name: 'Productos', icon: Package, path: '/productos' },
    { name: 'Proveedores', icon: Users, path: '/proveedores' },
    { name: 'Recomendaciones', icon: Lightbulb, path: '/recomendaciones' },
    { name: 'Pedidos', icon: ShoppingCart, path: '/pedidos' },
    { name: 'Análisis', icon: BarChart2, path: '/analisis' },
    { name: 'Configuración', icon: Settings, path: '/perfil' },
    { name: 'Cerrar sesión', icon: LogOut, path: '/logout' },
  ];

  return (
    <div className="productos-home-container">
      <aside className="productos-sidebar">
        <div className="productos-logo-container">
          <h1 className="productos-logo">Stocket</h1>
        </div>
       <nav className="productos-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`productos-nav-item ${currentPage === item.path ? 'productos-active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="productos-nav-icon" />
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      <div className="productos-main-content">
        <header className="productos-navbar">
          <div className="productos-navbar-container">
            <a href="#" className="productos-navbar-title">
              Productos Disponibles
            </a>
            <div className="productos-navbar-actions">
              <button className="productos-navbar-button">
                <MessageCircle className="productos-navbar-icon" onClick={() => navigate("/chat")} />
              </button>
              <button className="productos-navbar-button" onClick={handleVerCarrito}>
                <ShoppingBag className="productos-navbar-icon" />
                Ver Carrito ({carrito.length})
              </button>
            </div>
          </div>
        </header>

        <main className="productos-page-content">
          <div className="productos-content-container">
            <h2 className="productos-title">Explorar Productos</h2>
            <div className="productos-grid">
              {productos.map((producto) => (
                <div key={producto.id} className="productos-card">
                  {producto.imagen && (
                    <img
                      src={`http://localhost:8000${producto.imagen}`}
                      alt={producto.titulo}
                      className="productos-imagen"
                    />
                  )}
                  <h3 className="productos-nombre">{producto.titulo}</h3>
                  <p className="productos-precio">Precio: ${producto.precio.toFixed(2)}</p>
                  <p className="productos-stock">
                    Stock: {producto.stock}
                    {producto.stock < 20 && (
                      <AlertTriangle
                        size={16}
                        color="#ef4444"
                        style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }}
                      />
                    )}
                  </p>
                  <button
                    className="productos-boton-agregar-carrito"
                    onClick={() => handleAgregarAlCarrito(producto)}
                    disabled={producto.stock === 0}
                  >
                    <Plus size={20} style={{ marginRight: '0.5rem' }} />
                    {producto.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


