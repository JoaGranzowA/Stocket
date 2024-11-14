import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Home, Apple, Users, ShoppingCart, BarChart2, Lightbulb, Settings, LogOut, MessageCircle, ShoppingBag, ChevronRight } from 'lucide-react';
import { ACCESS_TOKEN } from '../constants';
import '../styles/DetallePedido.css';

export default function DetallePedido() {
  const { pedidoId } = useParams();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('/pedidos');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error('No hay token disponible');
      navigate('/login');
      return;
    }

    fetch(`http://localhost:8000/api/pedidos/${pedidoId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al cargar el detalle del pedido');
        }
        return res.json();
      })
      .then((data) => {
        setPedido(data);
      })
      .catch((error) => {
        console.error('Error al cargar el detalle del pedido:', error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pedidoId, navigate]);

  const handleMarcarComoEntregado = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error('No hay token disponible');
      return;
    }

    fetch(`http://localhost:8000/api/pedidos/${pedidoId}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado: 'entregado' }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al actualizar el estado del pedido');
        }
        return res.json();
      })
      .then((data) => {
        setPedido(data);
      })
      .catch((error) => {
        console.error('Error al marcar el pedido como entregado:', error);
        setError(error);
      });
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

  const orderStates = ['pagado', 'preparacion', 'camino', 'entregado'];

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  return (
    <div className="detalle-pedido-home-container">
      <aside className="detalle-pedido-sidebar">
        <div className="detalle-pedido-logo-container">
          <h1 className="detalle-pedido-logo">Stocket</h1>
        </div>
        
        <nav className="detalle-pedido-sidebar-nav">
          {sidebarSections.map((section, index) => (
            <div key={index} className="detalle-pedido-nav-section">
              <h2 className="detalle-pedido-nav-section-title">{section.title}</h2>
              {section.items.map((item) => (
                <button
                  key={item.name}
                  className={`detalle-pedido-nav-item ${currentPage === item.path ? 'detalle-pedido-active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="detalle-pedido-nav-icon" />
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="detalle-pedido-main-content">
        <header className="detalle-pedido-navbar">
          <div className="detalle-pedido-navbar-container">
            <h1 className="detalle-pedido-navbar-title">
            </h1>
            <div className="detalle-pedido-navbar-actions">
            </div>
          </div>
        </header>

        <main className="detalle-pedido-page-content">
          <div className="detalle-pedido-content-container">
            <div className="detalle-pedido-status-bar">
              {orderStates.map((state, index) => (
                <div key={state} className={`detalle-pedido-status-step ${orderStates.indexOf(pedido.estado) >= index ? 'active' : ''}`}>
                  <div className="detalle-pedido-status-icon"></div>
                  <p className="detalle-pedido-status-text">{state}</p>
                  {index < orderStates.length - 1 && <ChevronRight className="detalle-pedido-status-arrow" />}
                </div>
              ))}
            </div>

            <div className="detalle-pedido-info">
              <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleDateString()}</p>
              <p><strong>Total:</strong> ${Number(pedido.total).toFixed(2)}</p>
              <p><strong>Pagado:</strong> {pedido.pagado ? 'Sí' : 'No'}</p>
            </div>

            <h3 className="detalle-pedido-productos-title">Productos:</h3>
            {pedido.detalles && pedido.detalles.length > 0 ? (
              <ul className="detalle-pedido-productos-list">
                {pedido.detalles.map((detalle, index) => (
                  <li key={index} className="detalle-pedido-producto-item">
                    <p><strong>Producto:</strong> {detalle.producto.titulo}</p>
                    <p><strong>Vendedor:</strong> {detalle.producto.vendedor}</p>
                    <p><strong>Cantidad:</strong> {detalle.cantidad}</p>
                    <p><strong>Precio Unitario:</strong> ${Number(detalle.precio).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay productos en este pedido.</p>
            )}

            {pedido.estado === 'camino' && (
              <button
                className="detalle-pedido-marcar-entregado-button"
                onClick={handleMarcarComoEntregado}
              >
                Marcar como Entregado
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
