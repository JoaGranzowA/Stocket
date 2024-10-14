import React, { useState } from 'react';
import { Home, Users, Package, Lightbulb, ShoppingCart, BarChart2, Settings, MessageCircle, ShoppingBag, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "../styles/Pedidos.css"

export default function PedidosPage() {
  const [currentPage, setCurrentPage] = useState('/pedidos');
  const navigate = useNavigate();

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

  const pedidos = [
    { id: 1, fecha: '2023-05-15', descripcion: 'Pedido de verano', productos: ['Camisetas x10', 'Shorts x5'], total: 1500 },
    { id: 2, fecha: '2023-05-20', descripcion: 'Reposición de inventario', productos: ['Zapatillas x20', 'Calcetines x50'], total: 3000 },
    { id: 3, fecha: '2023-05-25', descripcion: 'Pedido especial', productos: ['Chaquetas x5', 'Pantalones x10'], total: 2000 },
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

        <main className="page-content">
          <div className="content-container">
            <h2 className="section-title">Historial de Pedidos</h2>
            <div className="pedidos-list">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="pedido-card">
                  <div className="pedido-header">
                    <span className="pedido-fecha">{pedido.fecha}</span>
                    <span className="pedido-total">${pedido.total}</span>
                  </div>
                  <h3 className="pedido-descripcion">{pedido.descripcion}</h3>
                  <ul className="pedido-productos">
                    {pedido.productos.map((producto, index) => (
                      <li key={index}>{producto}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}