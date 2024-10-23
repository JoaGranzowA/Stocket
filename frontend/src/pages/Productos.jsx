import React, { useState } from 'react';
import { Home, Users, Package, Lightbulb, ShoppingCart, BarChart2, Settings, MessageCircle, ShoppingBag, LogOut , Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "../styles/Productos.css"

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState('/productos');
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate('/chat');
  };


  // Ejemplo de datos de productos
  const products = [
    { id: 1, title: "Producto 1", price: 19.99, description: "Descripción del producto 1", image: "/placeholder.svg?height=200&width=200" },
    { id: 2, title: "Producto 2", price: 29.99, description: "Descripción del producto 2", image: "/placeholder.svg?height=200&width=200" },
    { id: 3, title: "Producto 3", price: 39.99, description: "Descripción del producto 3", image: "/placeholder.svg?height=200&width=200" },
    { id: 4, title: "Producto 4", price: 49.99, description: "Descripción del producto 4", image: "/placeholder.svg?height=200&width=200" },
  ];

  const navItems = [
    { name: 'Inicio', icon: Home, path: '/vendedor/home' },
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
            <div className="search-bar">
              <input type="text" placeholder="Buscar productos..." className="search-input" />
              <button className="search-button">
                <Search className="search-icon" />
              </button>
            </div>
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <img src={product.image} alt={product.title} className="product-image" />
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                  <p className="product-description">{product.description}</p>
                </div>
              ))}
            </div>
            <div className="pagination">
              <button className="pagination-button">1</button>
              <button className="pagination-button">2</button>
              <button className="pagination-button">3</button>
              <button className="pagination-button">Siguiente</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}