import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ShoppingCart, Box, FileText, Settings, LogOut, MessageCircle, Check, X } from 'lucide-react';
import "../styles/GestionPedidos.css";

export default function GestionPedidos() {
  const [currentPage, setCurrentPage] = useState('/gestion-pedidos');
  const navigate = useNavigate();

  // Pedidos de ejemplo
  const [pedidos, setPedidos] = useState([
    { id: 1, fecha_creacion: '2023-05-01', cliente: 'Juan Pérez', total: 150.50, estado: 'Pendiente' },
    { id: 2, fecha_creacion: '2023-05-02', cliente: 'María García', total: 75.25, estado: 'Aceptado' },
    { id: 3, fecha_creacion: '2023-05-03', cliente: 'Carlos Rodríguez', total: 200.00, estado: 'Rechazado' },
    { id: 4, fecha_creacion: '2023-05-04', cliente: 'Ana Martínez', total: 50.75, estado: 'Pendiente' },
    { id: 5, fecha_creacion: '2023-05-05', cliente: 'Luis Sánchez', total: 125.00, estado: 'Aceptado' },
    { id: 6, fecha_creacion: '2023-05-06', cliente: 'Elena López', total: 90.50, estado: 'Pendiente' },
  ]);

  const handleActualizarEstado = (id, nuevoEstado) => {
    setPedidos(pedidos.map(pedido => 
      pedido.id === id ? { ...pedido, estado: nuevoEstado } : pedido
    ));
  };

  const handleNavigation = (path) => {
    setCurrentPage(path);
    navigate(path);
  };

  const handleChatClick = () => {
    console.log("Chat clicked");
  };

  const navItems = [
    { name: 'Inicio', icon: Home, path: '/proveedor/home' },
    { name: 'Mis Productos', icon: Box, path: '/misproductos' },
    { name: 'Gestión de Pedidos', icon: ShoppingCart, path: '/gestion-pedidos' },
    { name: 'Facturación y Finanzas', icon: FileText, path: '/finanzas' },
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
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon className="nav-icon" />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="main-content">
        <header className="navbar">
          <div className="navbar-container">
            <h2 className="navbar-title">Gestión de Pedidos</h2>
            <div className="navbar-actions">
              <button className="navbar-button" onClick={handleChatClick}>
                <MessageCircle className="navbar-icon" />
                <span className="sr-only">Abrir chat</span>
              </button>
            </div>
          </div>
        </header>

        <main className="page-content">
          <div className="content-container">
            <h2 className="title">Historial de Pedidos</h2>
            <div className="pedidos-grid">
              {pedidos.map(pedido => (
                <div key={pedido.id} className="pedido-card">
                  <h3 className="pedido-numero">Pedido #{pedido.id}</h3>
                  <p className="pedido-fecha">Fecha: {new Date(pedido.fecha_creacion).toLocaleDateString()}</p>
                  <p className="pedido-cliente">Cliente: {pedido.cliente}</p>
                  <p className="pedido-total">Total: ${pedido.total.toFixed(2)}</p>
                  <p className={`pedido-estado estado-${pedido.estado.toLowerCase()}`}>
                    Estado: {pedido.estado}
                  </p>
                  <div className="pedido-acciones">
                    <button 
                      className="boton-accion boton-aceptar" 
                      onClick={() => handleActualizarEstado(pedido.id, 'Aceptado')}
                      disabled={pedido.estado !== 'Pendiente'}
                    >
                      <Check className="accion-icon" />
                      <span className="sr-only">Aceptar pedido</span>
                    </button>
                    <button 
                      className="boton-accion boton-rechazar" 
                      onClick={() => handleActualizarEstado(pedido.id, 'Rechazado')}
                      disabled={pedido.estado !== 'Pendiente'}
                    >
                      <X className="accion-icon" />
                      <span className="sr-only">Rechazar pedido</span>
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