import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Package, Lightbulb, ShoppingCart, BarChart2, Settings, MessageCircle, ShoppingBag, LogOut } from 'lucide-react';
import '../styles/Pedidos.css';
import { ACCESS_TOKEN } from '../constants';

export default function HistorialPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [currentPage, setCurrentPage] = useState('/pedidos');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error('No hay token disponible');
      navigate('/login');
      return;
    }

    // Obtener el historial de pedidos del customer
    fetch('http://localhost:8000/api/pedidos/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar el historial de pedidos');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Pedidos recibidos:', data);
        setPedidos(data);
      })
      .catch((error) => console.error('Error al cargar historial de pedidos:', error));
  }, [navigate]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const navItems = [
    { name: 'Inicio', icon: Home, path: '/vendedor/home' },
    { name: 'Productos', icon: Package, path: '/productos' },
    { name: 'Recomendaciones', icon: Lightbulb, path: '/recomendaciones' },
    { name: 'Pedidos', icon: ShoppingCart, path: '/pedidos' },
    { name: 'Análisis', icon: BarChart2, path: '/analisis' },
    { name: 'Configuración', icon: Settings, path: '/perfil' },
    { name: 'Cerrar sesión', icon: LogOut, path: '/logout' },
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
            <a href="#" className="navbar-title">
              Historial de Pedidos
            </a>
          </div>
        </header>

        <main className="page-content">
          <div className="content-container">
            <h2 className="title">Tus Pedidos</h2>
            {pedidos.length === 0 ? (
              <p className="historial-vacio">No has realizado ningún pedido aún.</p>
            ) : (
              <div className="historial-pedidos">
                <ul className="lista-pedidos">
                  {pedidos.map((pedido) => (
                    <li key={pedido.id} className="pedido-item">
                      <div className="pedido-detalles">
                        <h3>Pedido #{pedido.id}</h3>
                        <p>Fecha: {pedido.fecha ? new Date(pedido.fecha).toLocaleDateString() : 'Fecha no disponible'}</p>
                        <p>Total: ${Number(pedido.total).toFixed(2)}</p>
                      </div>
                      <div className="productos-pedido">
                        <h4>Productos:</h4>
                        <ul>
                          {pedido.detalles && Array.isArray(pedido.detalles) ? (
                            pedido.detalles.map((producto) => (
                              <li key={producto.id} className="producto-detalle">
                                <div className="detalle-titulo">{producto.producto ? producto.producto.titulo : 'Producto no disponible'}</div>
                                <div className="detalle-cantidad">Cantidad: {producto.cantidad}</div>
                                <div className="detalle-precio">Precio: ${Number(producto.precio).toFixed(2)}</div>
                              </li>
                            ))
                          ) : (
                            <p>No hay productos disponibles en este pedido.</p>
                          )}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

