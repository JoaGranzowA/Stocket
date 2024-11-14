import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Apple, Users, ShoppingCart, BarChart2, Lightbulb, Settings, LogOut, MessageCircle, ShoppingBag } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { ACCESS_TOKEN } from '../constants';
import "../styles/Analisis.css"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Analisis() {
  const [currentPage, setCurrentPage] = useState('/analisis');
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [supplierAnalysis, setSupplierAnalysis] = useState({});
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
      console.error('No hay token disponible');
      return;
    }

    // Llamada API para obtener los gastos mensuales
    fetch('http://localhost:8000/api/monthly-expenses/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al obtener los gastos mensuales');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Gastos mensuales recibidos:', data);
        if (Array.isArray(data)) {
          setMonthlyExpenses(data);
        } else {
          console.error('La respuesta no es un array:', data);
        }
      })
      .catch((error) => {
        console.error('Error en la llamada de gastos mensuales:', error);
      });

    // Llamada API para obtener el análisis de compras a proveedores
    fetch('http://localhost:8000/api/supplier-purchase-analysis/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al obtener el análisis de compras a proveedores');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Datos de análisis de compras a proveedores recibidos:', data);
        setSupplierAnalysis(data);
      })
      .catch((error) => {
        console.error('Error en la llamada de análisis de compras a proveedores:', error);
      });

    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);
  }, []);

  const handleNavigation = (path) => {
    setCurrentPage(path);
    navigate(path);
  };

  const handleVerCarrito = () => {
    navigate('/carrito');
  };

  const sidebarSections = [
    {
      title: "Panel de Control",
      items: [
        { name: 'Panel Principal', icon: Home, path: '/vendedor/home' },
        { name: 'Catálogo de Productos', icon: Apple, path: '/productos' },
        { name: 'Nuestros Proveedores', icon: Users, path: '/proveedores' },
      ]
    },
    {
      title: "Gestión y Operaciones",
      items: [
        { name: 'Mis Pedidos', icon: ShoppingCart, path: '/pedidos' },
        { name: 'Reportes de Ventas', icon: BarChart2, path: '/analisis' },
        { name: 'Recomendaciones', icon: Lightbulb, path: '/recomendaciones' },
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

  // Datos para el gráfico de gastos mensuales
  const labels = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const monthlyExpensesData = {
    labels,
    datasets: [
      {
        label: 'Gasto Mensual en Compras',
        data: labels.map((_, index) => {
          const expense = monthlyExpenses.find((item) => {
            const monthIndex = new Date(item.month).getMonth();
            return monthIndex === index;
          });
          return expense ? expense.total_gasto : 0;
        }),
        fill: false,
        borderColor: '#c7b4f3',
        tension: 0.1,
      },
    ],
  };

  // Datos para el gráfico de análisis de compras a proveedores
  const supplierAnalysisData = {
    labels: Object.keys(supplierAnalysis),
    datasets: [
      {
        label: 'Análisis de Compras a Proveedores',
        data: Object.values(supplierAnalysis),
        backgroundColor: 'rgba(199, 180, 243, 0.2)',
        borderColor: '#c7b4f3',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="analisis-home-container">
      <aside className="analisis-sidebar">
        <div className="analisis-logo-container">
          <h1 className="analisis-logo">Stocket</h1>
        </div>
        
        <nav className="analisis-sidebar-nav">
          {sidebarSections.map((section, index) => (
            <div key={index} className="analisis-nav-section">
              <h2 className="analisis-nav-section-title">{section.title}</h2>
              {section.items.map((item) => (
                <button
                  key={item.name}
                  className={`analisis-nav-item ${currentPage === item.path ? 'analisis-active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="analisis-nav-icon" />
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="analisis-main-content">
        <header className="analisis-navbar">
          <div className="analisis-navbar-container">
            <h1 className="analisis-navbar-title"></h1>
            <div className="analisis-navbar-actions">
              <button className="analisis-navbar-button" onClick={() => navigate("/chat")}>
                <MessageCircle className="analisis-navbar-icon" />
              </button>
              <button className="analisis-navbar-button" onClick={handleVerCarrito}>
                <ShoppingBag className="analisis-navbar-icon" />
              </button>
            </div>
          </div>
        </header>

        <main className="analisis-page-content">
  <div className="analisis-content-container">
    <div className="analisis-chart-section">
      <h3>Gasto Mensual en Compras</h3>
      <div className="analisis-chart-container">
        {monthlyExpenses.length === 0 ? (
          <p>No hay datos de gastos disponibles.</p>
        ) : (
          <Line data={monthlyExpensesData} />
        )}
      </div>
      <div className="analisis-chart-description">
        <p>
          Este gráfico muestra el gasto mensual en compras a lo largo del año. Puedes observar cómo varían los gastos mes a mes, 
          lo cual es útil para identificar patrones estacionales o meses en los que el gasto ha sido particularmente alto o bajo.
        </p>
      </div>
    </div>

    <div className="analisis-chart-section">
      <h3>Análisis de Compras a Proveedores</h3>
      <div className="analisis-chart-container">
        {Object.keys(supplierAnalysis).length === 0 ? (
          <p>No hay datos de compras a proveedores disponibles.</p>
        ) : (
          <Bar data={supplierAnalysisData} />
        )}
      </div>
      <div className="analisis-chart-description">
        <p>
          Este gráfico muestra el análisis de las compras realizadas a distintos proveedores. Permite identificar qué proveedores 
          tienen una mayor participación en las compras y proporciona una visión clara de la distribución del gasto entre ellos.
        </p>
      </div>
    </div>
  </div>
</main>
      </div>
    </div>
  );
}