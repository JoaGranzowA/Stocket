import React, { useState, useEffect } from 'react';
import { Home, Users, Apple,Package, Boxes, Lightbulb, ShoppingCart, BarChart2, Settings, MessageCircle, ShoppingBag, LogOut, TrendingUp, DollarSign, Truck, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "../styles/Home.css"

export default function HomePage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('/vendedor/home');
  const [salesData, setSalesData] = useState({ total: 0, increase: 0 });
  const [ordersData, setOrdersData] = useState({ total: 0, pending: 0 });
  const [inventoryData, setInventoryData] = useState({ total: 0, lowStock: 0 });
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    // Simulating API calls to fetch data
    setSalesData({ total: 15000, increase: 12 });
    setOrdersData({ total: 150, pending: 23 });
    setInventoryData({ total: 500, lowStock: 15 });
    setTopProducts([
      { name: "Producto A", sales: 120 },
      { name: "Producto B", sales: 95 },
      { name: "Producto C", sales: 80 },
      { name: "Producto D", sales: 75 },
      { name: "Producto E", sales: 60 },
    ]);
  }, []);

  const handleChatClick = () => {
    navigate('/chat');
  };

  const navItems = [
    { name: 'Inicio', icon: Home, path: '/vendedor/home' },
    { name: 'Productos', icon: Apple, path: '/productos' },
    { name: 'Proveedores', icon: Users, path: '/proveedores' },
    { name: 'Recomendaciones', icon: Lightbulb, path: '/recomendaciones' },
    { name: 'Pedidos', icon: ShoppingCart, path: '/pedidos' },
    { name: 'Mi Stock', icon: Boxes, path: '/stock' },
    { name: 'Análisis', icon: BarChart2, path: '/analisis' },
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
              Panel de Control
            </a>
            <div className="navbar-actions">
              <button className="navbar-button" onClick={handleChatClick}>
                <MessageCircle className="navbar-icon" />
              </button>
              <button className="navbar-button">
                <ShoppingBag className="navbar-icon" />
              </button>
            </div>
          </div>
        </header>

        <main className="page-content">
          <div className="content-container">
            <h2 className="welcome-title">Bienvenido a tu Panel de Control</h2>
            
            <div className="dashboard-grid">
              <div className="dashboard-card sales">
                <div className="card-icon">
                  <TrendingUp />
                </div>
                <div className="card-content">
                  <h3>Ventas Totales</h3>
                  <p className="card-value">${salesData.total.toLocaleString()}</p>
                  <p className="card-subtext">↑ {salesData.increase}% desde el mes pasado</p>
                </div>
              </div>
              
              <div className="dashboard-card orders">
                <div className="card-icon">
                  <ShoppingCart />
                </div>
                <div className="card-content">
                  <h3>Pedidos</h3>
                  <p className="card-value">{ordersData.total}</p>
                  <p className="card-subtext">{ordersData.pending} pedidos pendientes</p>
                </div>
              </div>
              
              <div className="dashboard-card inventory">
                <div className="card-icon">
                  <Package />
                </div>
                <div className="card-content">
                  <h3>Inventario</h3>
                  <p className="card-value">{inventoryData.total}</p>
                  <p className="card-subtext">{inventoryData.lowStock} productos con bajo stock</p>
                </div>
              </div>
            </div>

            <div className="dashboard-row">
              <div className="dashboard-column">
                <div className="dashboard-panel">
                  <h3 className="panel-title">Productos Más Vendidos</h3>
                  <ul className="top-products-list">
                    {topProducts.map((product, index) => (
                      <li key={index} className="top-product-item">
                        <span className="product-name">{product.name}</span>
                        <span className="product-sales">{product.sales} ventas</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="dashboard-column">
                <div className="dashboard-panel">
                  <h3 className="panel-title">Alertas</h3>
                  <ul className="alerts-list">
                    <li className="alert-item">
                      <AlertCircle className="alert-icon" />
                      <span>5 productos están por agotarse</span>
                    </li>
                    <li className="alert-item">
                      <Truck className="alert-icon" />
                      <span>3 pedidos retrasados en envío</span>
                    </li>
                    <li className="alert-item">
                      <DollarSign className="alert-icon" />
                      <span>2 pagos pendientes de proveedores</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="dashboard-panel full-width">
              <h3 className="panel-title">Resumen de Ventas Mensuales</h3>
              <div className="sales-chart">
                {/* Aquí iría un componente de gráfico de ventas */}
                <p className="placeholder-text">Gráfico de ventas mensuales</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}