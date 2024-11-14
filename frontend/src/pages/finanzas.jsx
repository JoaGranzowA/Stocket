import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import { Home, Box, ShoppingCart, FileText, Settings, LogOut, MessageCircle, CirclePercent } from 'lucide-react';
import { ACCESS_TOKEN } from '../constants';
import "../styles/finanzas.css";

export default function Finanzas() {
  const [currentPage, setCurrentPage] = useState('/finanzas');
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    // Fetch data for monthly sales chart
    fetch('http://localhost:8000/api/sales-data/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(data => {
        console.log("Ventas mensuales:", data.salesMonthly);
        setSalesData(data.salesMonthly);
      })
      .catch(error => console.error('Error fetching sales data:', error));

    // Fetch data for top products chart
    fetch('http://localhost:8000/api/top-products/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(data => {
        console.log("Productos más vendidos:", data.topProducts);
        setTopProducts(data.topProducts);
      })
      .catch(error => console.error('Error fetching top products data:', error));
  }, []);

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

  // Configuración de datos para el gráfico de Ventas Mensuales
  const salesChartData = {
    labels: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    datasets: [{
      label: 'Ventas Mensuales',
      data: salesData.map(item => item.totalSales),
      fill: false,
      borderColor: '#8b5cf6',
      tension: 0.1,
    }],
  };

  // Configuración de datos para el gráfico de Productos Más Vendidos
  const topProductsChartData = {
    labels: topProducts.map(product => product.name),
    datasets: [{
      label: 'Cantidad Vendida',
      data: topProducts.map(product => product.quantitySold),
      backgroundColor: '#a78bfa',
    }],
  };

  return (
    <div className="fn-container">
      <aside className="fn-sidebar">
        <div className="fn-logo-container">
          <h1 className="fn-logo">Stocket</h1>
        </div>
        <nav className="fn-sidebar-nav">
          {sidebarSections.map((section, index) => (
            <div key={index} className="fn-nav-section">
              <h2 className="fn-nav-section-title">{section.title}</h2>
              {section.items.map((item) => (
                <button
                  key={item.name}
                  className={`fn-nav-item ${currentPage === item.path ? 'fn-active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="fn-nav-icon" />
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="fn-main-content">
        <header className="fn-navbar">
          <div className="fn-navbar-container">
            <h1 className="fn-navbar-title">Resumen Financiero</h1>
            <div className="fn-navbar-actions">
              <button className="fn-navbar-button" onClick={() => navigate("/chat")}>
                <MessageCircle className="fn-navbar-icon" />
              </button>
            </div>
          </div>
        </header>

        <main className="fn-page-content">
          <div className="fn-content-container">
            <div className="fn-charts-grid">
              <div className="fn-chart-container">
                <h3 className="fn-chart-title">Ventas Mensuales</h3>
                <div className="fn-chart">
                  <Line data={salesChartData} />
                </div>
                <p className="fn-chart-description">
                  Este gráfico muestra las ventas mensuales a lo largo del año, permitiéndote identificar tendencias y patrones estacionales en tus ingresos.
                </p>
              </div>

              <div className="fn-chart-container">
                <h3 className="fn-chart-title">Productos Más Vendidos</h3>
                <div className="fn-chart">
                  <Bar data={topProductsChartData} />
                </div>
                <p className="fn-chart-description">
                  Este gráfico presenta los productos más vendidos, ayudándote a identificar tus artículos estrella y optimizar tu inventario en consecuencia.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}