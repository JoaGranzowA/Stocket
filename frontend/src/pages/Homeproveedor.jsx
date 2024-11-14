import React, { useState, useEffect } from 'react';
import { Home, Users, Package, Lightbulb, ShoppingCart, BarChart2, Settings, MessageCircle, ShoppingBag, LogOut, DollarSign, Bell, Box, FileText, CirclePercent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';
import "../styles/Homeproveedor.css"

export default function HomePage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('/proveedor/home');
  const [productos, setProductos] = useState([]);

  const handleChatClick = () => {
    navigate('/chat');
  };

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    console.log('Token de autenticación:', token);

    fetch('http://localhost:8000/api/productos/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }
        return response.json();
      })
      .then((data) => setProductos(data))
      .catch((error) => console.error('Error fetching productos:', error));
  }, []);

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

  const getRandomColor = () => {
    const colors = ['#FFA07A', '#98FB98', '#87CEFA', '#DDA0DD', '#F0E68C'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="hp-container">
      {/* Sidebar */}
      <aside className="hp-sidebar">
        <div className="hp-logo-wrapper">
          <h1 className="hp-logo-text">Stocket</h1>
        </div>
        <nav className="hp-nav">
          {sidebarSections.map((section, index) => (
            <div key={index} className="hp-nav-section">
              <h2 className="hp-nav-section-title">{section.title}</h2>
              {section.items.map((item) => (
                <button
                  key={item.name}
                  className={`hp-nav-button ${currentPage === item.path ? 'hp-nav-button-active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="hp-nav-icon" />
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="hp-main">
        {/* Navbar */}
        <header className="hp-header">
          <div className="hp-header-content">
            <a href="#" className="hp-header-title"></a>
            <div className="hp-header-actions">
              <button className="hp-header-button" onClick={handleChatClick}>
                <MessageCircle className="hp-header-icon" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="hp-content">
          <div className="hp-content-wrapper">
            <h2 className="hp-welcome-title">Bienvenido a Stocket</h2>

            {/* Beneficios para proveedores */}
            <div className="hp-benefits-grid">
              <div className="hp-benefit-card">
                <div className="hp-benefit-icon"><BarChart2 /></div>
                <h3 className="hp-benefit-title">Análisis de Ventas</h3>
                <p className="hp-benefit-description">Obtén insights valiosos sobre el rendimiento de tus productos y tendencias de mercado.</p>
              </div>
              <div className="hp-benefit-card">
                <div className="hp-benefit-icon"><Users /></div>
                <h3 className="hp-benefit-title">Red de Clientes</h3>
                <p className="hp-benefit-description">Conecta con nuevos clientes y fortalece relaciones comerciales existentes.</p>
              </div>
              <div className="hp-benefit-card">
                <div className="hp-benefit-icon"><Package /></div>
                <h3 className="hp-benefit-title">Gestión de Inventario</h3>
                <p className="hp-benefit-description">Administra tu inventario de manera eficiente y mantén un control preciso de tus productos.</p>
              </div>
            </div>

            {/* Stock Section */}
            <div className="hp-stock">
              <h3 className="hp-stock-title">Stock de Productos</h3>
              <div className="hp-stock-list">
                {productos.length > 0 ? (
                  productos.map((producto) => (
                    <div key={producto.id} className="hp-stock-item">
                      <div className="hp-stock-item-color"></div>
                      <div className="hp-stock-item-content">
                        <h4 className="hp-stock-item-name">{producto.titulo}</h4>
                        <p className="hp-stock-item-description">Descripción: {producto.descripcion}</p>
                        <p className="hp-stock-quantity">Stock: {producto.stock}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No hay productos disponibles</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}