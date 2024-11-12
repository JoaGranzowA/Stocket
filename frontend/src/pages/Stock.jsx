import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Apple, Settings, LogOut, Minus, AlertTriangle, ShoppingCart, BarChart2, Users, Lightbulb, Boxes } from 'lucide-react';
import { ACCESS_TOKEN } from '../constants';
import "../styles/Stock.css";

export default function GestorDeStock() {
  const [currentPage, setCurrentPage] = useState('/stock');
  const [stockItems, setStockItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error('No hay token disponible');
      return;
    }

    fetch('http://localhost:8000/api/stock-disponible/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          console.log('Productos en stock:', data);
          setStockItems(data);
        } else {
          console.error('La respuesta no es un array:', data);
        }
      })
      .catch((error) => {
        console.error('Error al obtener el stock disponible:', error);
      });
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
            item.id === productoId ? { ...item, stock_restante: item.stock_restante - cantidad } : item
          )
        );
      })
      .catch((error) => {
        console.error('Error al actualizar el stock:', error);
      });
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
              {React.createElement(item.icon, { className: "nav-icon" })}
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      <div className="main-content">
        <header className="navbar">
          <div className="navbar-container">
            <h1 className="navbar-title">Gestor de Stock</h1>
          </div>
        </header>

        <main className="page-content">
          <div className="content-container">
            <h2 className="section-title">Gestión de Stock</h2>
            {stockItems.length === 0 ? (
              <p className="stock-empty">No tienes productos en stock.</p>
            ) : (
              <div className="stock-content">
                <ul className="stock-list">
                  {stockItems.map((item) => (
                    <li key={item.id} className="stock-item">
                      <div className="item-details">
                        <h3 className="item-title">{typeof item.producto === 'object' ? item.producto.titulo : item.producto}</h3>
                        <p className="item-price">${item.precio.toFixed(2)}</p>
                        <p className="item-stock">
                          Stock Restante: {item.stock_restante}
                          {item.stock_restante < 20 && (
                            <AlertTriangle className="stock-alert-icon" size={16} />
                          )}
                        </p>
                      </div>
                      <div className="item-actions">
                        <button
                          className="decrease-stock-button"
                          onClick={() => actualizarStock(item.id, 1)}
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






