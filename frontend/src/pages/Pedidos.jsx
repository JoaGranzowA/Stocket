import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Apple, Users, ShoppingCart, BarChart2, Lightbulb, Settings, LogOut, ChevronRight } from 'lucide-react';
import '../styles/Pedidos.css';
import { ACCESS_TOKEN } from '../constants';

export default function HistorialPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [currentPage, setCurrentPage] = useState('/pedidos');
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error('No hay token disponible');
      navigate('/login');
      return;
    }

    fetch('http://localhost:8000/api/pedido/', {
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

    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);
  }, [navigate]);

  const handleNavigation = (path) => {
    setCurrentPage(path);
    navigate(path);
  };

  const handleVerDetalle = (pedidoId) => {
    if (pedidoId) {
      navigate(`/pedidos/${pedidoId}`);
    } else {
      console.error('No se encontró el ID del pedido asociado');
    }
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
    <div className="pedidos-home-container">
      <aside className="pedidos-sidebar">
        <div className="pedidos-logo-container">
          <h1 className="pedidos-logo">Stocket</h1>
        </div>

        <nav className="pedidos-sidebar-nav">
          {sidebarSections.map((section, index) => (
            <div key={index} className="pedidos-nav-section">
              <h2 className="pedidos-nav-section-title">{section.title}</h2>
              {section.items.map((item) => (
                <button
                  key={item.name}
                  className={`pedidos-nav-item ${currentPage === item.path ? 'pedidos-active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="pedidos-nav-icon" />
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="pedidos-main-content">
        <header className="pedidos-navbar">
          <div className="pedidos-navbar-container">
            <h1 className="pedidos-navbar-title"></h1>
            <div className="pedidos-navbar-actions">
              {/* Puedes agregar botones o acciones adicionales aquí si es necesario */}
            </div>
          </div>
        </header>

        <main className="pedidos-page-content">
          <div className="pedidos-content-container">
            <h2 className="pedidos-title">Tus Pedidos</h2>
            {pedidos.length === 0 ? (
              <p className="pedidos-historial-vacio">No has realizado ningún pedido aún.</p>
            ) : (
              <div className="pedidos-historial-pedidos">
                <ul className="pedidos-lista-pedidos">
                  {pedidos.map((pedido) => (
                    <li key={pedido.id} className="pedidos-pedido-item">
                      <div className="pedidos-pedido-detalles">
                        <h3>Pedido #{pedido.id}</h3>
                        <p>Fecha: {pedido.fecha ? new Date(pedido.fecha).toLocaleDateString() : 'Fecha no disponible'}</p>
                        <p>Total: ${Number(pedido.total).toFixed(2)}</p>
                      </div>
                      <button className="pedidos-ver-detalle-button" onClick={() => handleVerDetalle(pedido.id)}>
                        Ver Detalle
                        <ChevronRight className="pedidos-ver-detalle-icon" />
                      </button>
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
