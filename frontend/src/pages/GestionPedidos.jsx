import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Apple, Boxes, Lightbulb, ShoppingCart, Box, FileText, Settings, LogOut, BarChart2, MessageCircle, ShoppingBag, CirclePercent } from 'lucide-react';
import { ACCESS_TOKEN } from '../constants';
import '../styles/GestionPedidos.css';

export default function PedidosProveedor() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('/gestionpedidos');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error('No hay token disponible');
      navigate('/login');
      return;
    }

    fetch('http://localhost:8000/api/pedidos-proveedor/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al cargar los pedidos del proveedor');
        }
        return res.json();
      })
      .then((data) => {
        setPedidos(data);
      })
      .catch((error) => {
        console.error('Error al cargar los pedidos del proveedor:', error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleCambiarEstado = (pedidoId, nuevoEstado) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    fetch(`http://localhost:8000/api/pedidos-proveedor/${pedidoId}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado: nuevoEstado }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al cambiar el estado del pedido');
        }
        return res.json();
      })
      .then((actualizado) => {
        setPedidos((prevPedidos) =>
          prevPedidos.map((pedido) => (pedido.id === actualizado.id ? actualizado : pedido))
        );
      })
      .catch((error) => {
        console.error('Error al cambiar el estado del pedido:', error);
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
        { name: 'Panel Principal', icon: Home, path: '/proveedor/home' },
        { name: 'Gestión de Productos', icon: Box, path: '/misproductos' },
        { name: 'Administrar Pedidos', icon: ShoppingCart, path: '/gestionpedidos' },
      ]
    },
    {
      title: "Gestión y Operaciones",
      items: [
        { name: 'Resumen Financiero', icon: FileText, path: '/finanzas' },
        { name: 'Ofertas de Reabastecimiento', icon: CirclePercent, path: '/verstock' },
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

  if (loading) {
    return <div className="pp-loading">Cargando...</div>;
  }

  if (error) {
    return <div className="pp-error">Error: {error.message}</div>;
  }

  return (
    <div className="pp-container">
      <aside className="pp-sidebar">
        <div className="pp-sidebar-header">
          <h1 className="pp-sidebar-title">Stocket</h1>
        </div>
        <nav className="pp-sidebar-nav">
          {sidebarSections.map((section, index) => (
            <div key={index} className="pp-sidebar-section">
              <h2 className="pp-sidebar-section-title">{section.title}</h2>
              {section.items.map((item) => (
                <button
                  key={item.name}
                  className={`pp-sidebar-nav-item ${currentPage === item.path ? 'pp-active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="pp-sidebar-nav-icon" />
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="pp-main-content">
        <header className="pp-navbar">
          <div className="pp-navbar-container">
            <h1 className="pp-navbar-title"></h1>
            <div className="pp-navbar-actions">
              <button className="pp-navbar-action-button">
                <MessageCircle />
              </button>
              <button className="pp-navbar-action-button">

              </button>
            </div>
          </div>
        </header>

        <main className="pp-content">
          <div className="pp-content-container">
            <h2 className="pp-content-title">Pedidos de tus Productos</h2>
            {pedidos.length === 0 ? (
              <p className="pp-no-pedidos">No tienes pedidos actualmente.</p>
            ) : (
              <ul className="pp-pedidos-list">
                {pedidos.map((pedido) => (
                  <li key={pedido.id} className="pp-pedido-item">
                    <div className="pp-pedido-header">
                      <h3 className="pp-pedido-title">Pedido #{pedido.id}</h3>
                      <span className={`pp-pedido-status pp-${pedido.estado}`}>
                        {pedido.estado}
                      </span>
                    </div>
                    <p className="pp-pedido-info">Cliente: {pedido.cliente.username}</p>
                    <p className="pp-pedido-info">Total: ${Number(pedido.total).toFixed(2)}</p>
                    <p className="pp-pedido-info">Fecha: {new Date(pedido.fecha).toLocaleDateString()}</p>
                    
                    <h4 className="pp-productos-title">Productos comprados:</h4>
                    {pedido.detalles && pedido.detalles.length > 0 ? (
                      <ul className="pp-productos-list">
                        {pedido.detalles.map((detalle, index) => (
                          <li key={index} className="pp-producto-item">
                            <p className="pp-producto-info">Producto: {detalle.producto.titulo}</p>
                            <p className="pp-producto-info">Cantidad: {detalle.cantidad}</p>
                            <p className="pp-producto-info">Precio Unitario: ${Number(detalle.precio).toFixed(2)}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="pp-no-productos">No hay productos en este pedido.</p>
                    )}

                    <div className="pp-pedido-actions">
                      {pedido.estado === 'pagado' && (
                        <button
                          onClick={() => handleCambiarEstado(pedido.id, 'preparacion')}
                          className="pp-action-button pp-preparacion"
                        >
                          Marcar como En Preparación
                        </button>
                      )}
                      {pedido.estado === 'preparacion' && (
                        <button
                          onClick={() => handleCambiarEstado(pedido.id, 'camino')}
                          className="pp-action-button pp-camino"
                        >
                          Marcar como En Camino
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}