import React, { useState } from 'react';
import { Home, Users, Package, Lightbulb, ShoppingCart, BarChart2, Settings, MessageCircle, ShoppingBag, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "../styles/Home.css"

export default function HomePage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('/home');

  const handleChatClick = () => {
    navigate('/chat');
  };

  const navItems = [
    { name: 'Inicio', icon: Home, path: '/home' },
    { name: 'Productos', icon: Package, path: '/productos' },
    { name: 'Recomendaciones', icon: Lightbulb, path: '/recomendaciones' },
    { name: 'Pedidos', icon: ShoppingCart, path: '/pedidos' },
    { name: 'Análisis', icon: BarChart2, path: '/analisis' },
    { name: 'Configuración', icon: Settings, path: '/datos' },
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
              <button className="navbar-button">
                <MessageCircle className="navbar-icon" onClick={handleChatClick} />
              </button>
              <button className="navbar-button">
                <ShoppingBag className="navbar-icon" />
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
                Gestiona tu inventario, proveedores y pedidos de manera eficiente con Stocket. 
                Explora nuestras funciones y optimiza tu negocio hoy mismo.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 