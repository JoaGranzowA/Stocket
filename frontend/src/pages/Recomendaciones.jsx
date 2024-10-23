import React, { useState } from 'react';
import { Home, Users, Package, Lightbulb, ShoppingCart, BarChart2, Settings, MessageCircle, ShoppingBag, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "../styles/Recomendaciones.css"

export default function RecomendacionesPage() {
  const [currentPage, setCurrentPage] = useState('/recomendaciones');
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate('/chat');
  };

  const navItems = [
    { name: 'Inicio', icon: Home, path: '/vendedor/home' },
    { name: 'Productos', icon: Package, path: '/productos' },
    { name: 'Recomendaciones', icon: Lightbulb, path: '/recomendaciones' },
    { name: 'Pedidos', icon: ShoppingCart, path: '/pedidos' },
    { name: 'Análisis', icon: BarChart2, path: '/analisis' },
    { name: 'Configuración', icon: Settings, path: '/datos' },
    { name: 'Cerrar sesión', icon: LogOut, path: '/logout' },
  ];

  const recomendaciones = [
    {
      categoria: 'Más Comprados',
      productos: [
        { nombre: 'Camiseta Básica', precio: 15.99, proveedor: 'TextilMax' },
        { nombre: 'Jeans Clásicos', precio: 39.99, proveedor: 'DenimCo' },
        { nombre: 'Zapatillas Deportivas', precio: 59.99, proveedor: 'SportGear' },
      ]
    },
    {
      categoria: 'Más Vendidos',
      productos: [
        { nombre: 'Vestido de Verano', precio: 29.99, proveedor: 'FashionStyle' },
        { nombre: 'Sudadera con Capucha', precio: 34.99, proveedor: 'UrbanWear' },
        { nombre: 'Pantalones de Yoga', precio: 24.99, proveedor: 'FitLife' },
      ]
    },
    {
      categoria: 'De Tus Proveedores Habituales',
      productos: [
        { nombre: 'Chaqueta de Cuero', precio: 89.99, proveedor: 'LeatherCraft' },
        { nombre: 'Bufanda de Lana', precio: 19.99, proveedor: 'WinterWarmth' },
        { nombre: 'Gorra de Béisbol', precio: 14.99, proveedor: 'UrbanWear' },
      ]
    },
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
            <h2 className="section-title">Recomendaciones de Productos</h2>
            <div className="recomendaciones-list">
              {recomendaciones.map((categoria, index) => (
                <div key={index} className="categoria-card">
                  <h3 className="categoria-titulo">{categoria.categoria}</h3>
                  <div className="productos-grid">
                    {categoria.productos.map((producto, prodIndex) => (
                      <div key={prodIndex} className="producto-card">
                        <h4 className="producto-nombre">{producto.nombre}</h4>
                        <p className="producto-precio">${producto.precio.toFixed(2)}</p>
                        <p className="producto-proveedor">{producto.proveedor}</p>
                      </div>
                    ))}
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