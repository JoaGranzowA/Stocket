import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Apple, Users, ShoppingCart, BarChart2, Lightbulb, Settings, LogOut, Minus, AlertTriangle, Boxes, TrendingUp, Users as UsersIcon, ShieldCheck, MessageCircle, ShoppingBag } from 'lucide-react';
import { ACCESS_TOKEN } from '../constants';
import "../styles/Stock.css";

export default function GestorDeStock() {
  const [currentPage, setCurrentPage] = useState('/vendedor/home');
  const [stockItems, setStockItems] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error('No hay token disponible');
      return;
    }

    fetch('http://localhost:8000/api/stock-agrupado/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          console.log('Productos agrupados en stock:', data);
          setStockItems(data);
        } else {
          console.error('La respuesta no es un array:', data);
        }
      })
      .catch((error) => {
        console.error('Error al obtener el stock disponible:', error);
      });

    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);
  }, []);

  const actualizarStock = (productoId, cantidad) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error('No hay token disponible');
      return;
    }

    fetch(`http://localhost:8000/api/actualizar-stock/${productoId}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ cantidad }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al actualizar el stock');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Stock actualizado:', data);
        setStockItems((prevStockItems) =>
          prevStockItems.map((item) =>
            item.producto_id === productoId ? { ...item, stock_restante: item.stock_restante - cantidad } : item
          )
        );
      })
      .catch((error) => {
        console.error('Error al actualizar el stock:', error);
      });
  };

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

  return (
    <div className="stock-manager-container">
      <aside className="stock-manager-sidebar">
        <div className="stock-manager-logo-container">
          <h1 className="stock-manager-logo">Stocket</h1>
        </div>
        
        <nav className="stock-manager-sidebar-nav">
          {sidebarSections.map((section, index) => (
            <div key={index} className="stock-manager-nav-section">
              <h2 className="stock-manager-nav-section-title">{section.title}</h2>
              {section.items.map((item) => (
                <button
                  key={item.name}
                  className={`stock-manager-nav-item ${currentPage === item.path ? 'stock-manager-active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="stock-manager-nav-icon" />
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="stock-manager-main-content">
        <header className="stock-manager-navbar">
          <div className="stock-manager-navbar-container">
            <h1 className="stock-manager-navbar-title">Gestión de Stock</h1>
            <div className="stock-manager-navbar-actions">
              <button className="stock-manager-navbar-button" onClick={() => navigate("/chat")}>
                <MessageCircle className="stock-manager-navbar-icon" />
              </button>
              <button className="stock-manager-navbar-button" onClick={handleVerCarrito}>
                <ShoppingBag className="stock-manager-navbar-icon" />
              </button>
            </div>
          </div>
        </header>

        <main className="stock-manager-page-content">
          <div className="stock-manager-content-container">
            <section className="stock-manager-info-section">
              <h2 className="stock-manager-info-title">Bienvenido a Stocket</h2>
              <div className="stock-manager-info-grid">
                <div className="stock-manager-info-card">
                  <TrendingUp className="stock-manager-info-icon" />
                  <h3>Crecimiento Constante</h3>
                  <p>Stocket está transformando la forma en que los pequeños comercios gestionan sus productos, ayudándoles a crecer de manera sostenible.</p>
                </div>
                <div className="stock-manager-info-card">
                  <UsersIcon className="stock-manager-info-icon" />
                  <h3>Comunidad en Expansión</h3>
                  <p>Formamos parte de una comunidad dinámica de emprendedores y proveedores que trabajan juntos para mejorar la eficiencia y el alcance de sus negocios.</p>
                </div>
                <div className="stock-manager-info-card">
                  <ShieldCheck className="stock-manager-info-icon" />
                  <h3>Seguridad Garantizada</h3>
                  <p>Tu información es importante para nosotros. Stocket garantiza la seguridad de tus datos mediante medidas de protección avanzadas.</p>
                </div>
              </div>
            </section>

            <h2 className="stock-manager-section-title">Tu Inventario Actual</h2>
            {stockItems.length === 0 ? (
              <p className="stock-manager-empty">No tienes productos en stock.</p>
            ) : (
              <div className="stock-manager-stock-content">
                <ul className="stock-manager-stock-list">
                  {stockItems.map((item) => (
                    <li key={item.producto_id} className="stock-manager-stock-item">
                      <div className="stock-manager-item-details">
                        <h3 className="stock-manager-item-title">{item.titulo}</h3>
                        <p className="stock-manager-item-price">${item.precio.toFixed(2)}</p>
                        <p className="stock-manager-item-stock">
                          Stock Restante: {item.stock_restante}
                          {item.stock_restante < 20 && (
                            <AlertTriangle className="stock-manager-stock-alert-icon" size={16} />
                          )}
                        </p>
                      </div>
                      <div className="stock-manager-item-actions">
                        <button
                          className="stock-manager-decrease-stock-button"
                          onClick={() => actualizarStock(item.producto_id, 1)}
                          disabled={item.stock_restante <= 0}
                        >
                          <Minus size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}