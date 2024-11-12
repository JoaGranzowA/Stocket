import React, { useState } from 'react';
import { Home, Users, Package, Lightbulb, ShoppingCart, BarChart2, Settings, MessageCircle, ShoppingBag, LogOut, DollarSign, Bell, Box, FileText, CirclePercent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "../styles/Homeproveedor.css"

export default function HomePage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('/proveedor/home');

  const handleChatClick = () => {
    navigate('/chat');
  };


  const navItems = [
    { name: 'Inicio', icon: Home, path: '/proveedor/home' },
    { name: 'Mis Productos', icon: Box, path: '/misproductos' },
    { name: 'Gestión de Pedidos', icon: ShoppingCart, path: '/gestionpedidos' },
    { name: 'Facturación y Finanzas', icon: FileText, path: '/finanzas' },
    { name: 'Ofertar', icon:CirclePercent, path: '/verstock' },
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

      {/* Main content */}
      <div className="main-content">
        {/* Navbar */}
        <header className="navbar">
          <div className="navbar-container">
            <a href="#" className="navbar-title">
            </a>
            <div className="navbar-actions">
              <button className="navbar-button" onClick={handleChatClick}>
                <MessageCircle className="navbar-icon" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
          <div className="content-container">
            <h2 className="welcome-title">Bienvenido a Stocket</h2>
            <div className="welcome-card">
              <p className="welcome-text">
              Optimiza la gestión de tus productos, clientes y pedidos con STOCKET. Accede a herramientas avanzadas para controlar tu inventario, negociar directamente con tus clientes y mejorar la eficiencia de tu negocio. ¡Haz crecer tu red de distribución de manera más inteligente hoy mismo!
              </p>
            </div>

            {/* New Dashboard Section */}
            <div className="dashboard-container">
              <h3 className="dashboard-title">Panel de Control</h3>
              <div className="dashboard-grid">
                <div className="dashboard-card">
                  <ShoppingCart className="dashboard-icon" />
                  <h4>Pedidos Pendientes</h4>
                  <p className="dashboard-number">12</p>
                </div>
                <div className="dashboard-card">
                  <Bell className="dashboard-icon" />
                  <h4>Nuevos Mensajes</h4>
                  <p className="dashboard-number">5</p>
                </div>
                <div className="dashboard-card">
                  <Package className="dashboard-icon" />
                  <h4>Productos Más Vendidos</h4>
                  <ul className="dashboard-list">
                    <li>Producto A</li>
                    <li>Producto B</li>
                    <li>Producto C</li>
                  </ul>
                </div>
                <div className="dashboard-card">
                  <DollarSign className="dashboard-icon" />
                  <h4>Ventas del Mes</h4>
                  <p className="dashboard-number">$15,234</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}