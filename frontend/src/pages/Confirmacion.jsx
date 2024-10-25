import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Package, Lightbulb, ShoppingCart, BarChart2, ShoppingBag, Settings, MessageCircle, LogOut, Plus, AlertTriangle } from 'lucide-react';
import '../styles/Confirmacion.css';

export default function ConfirmacionPedido() {
  const navigate = useNavigate();
  const [ultimoPedido, setUltimoPedido] = useState([]);
  const [ultimoTotal, setUltimoTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState('/confirmacion');

  useEffect(() => {
    const pedidoGuardado = JSON.parse(localStorage.getItem('ultimoPedido')) || [];
    const totalGuardado = JSON.parse(localStorage.getItem('ultimoTotal')) || 0;
    setUltimoPedido(pedidoGuardado);
    setUltimoTotal(totalGuardado);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const navItems = [
    { name: 'Inicio', icon: Home, path: '/vendedor/home' },
    { name: 'Productos', icon: Package, path: '/productos' },
    { name: 'Recomendaciones', icon: Lightbulb, path: '/recomendaciones' },
    { name: 'Pedidos', icon: ShoppingCart, path: '/pedidos' },
    { name: 'Análisis', icon: BarChart2, path: '/analisis' },
    { name: 'Configuración', icon: Settings, path: '/perfil' },
    { name: 'Cerrar sesión', icon: LogOut, path: '/logout' },
  ];

  return (
    <div className="confirmacion-home-container">
      <aside className="confirmacion-sidebar">
        <div className="confirmacion-logo-container">
          <h1 className="confirmacion-logo">Stocket</h1>
        </div>
        <nav className="confirmacion-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`confirmacion-nav-item ${currentPage === item.path ? 'confirmacion-active' : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon className="confirmacion-nav-icon" />
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      <div className="confirmacion-main-content">
        <header className="confirmacion-navbar">
          <div className="confirmacion-navbar-container">
            <a href="#" className="confirmacion-navbar-title">
              Confirmación del Pedido
            </a>
          </div>
        </header>

        <main className="confirmacion-page-content">
          <div className="confirmacion-content-container">
            <h2 className="confirmacion-title">¡Gracias por tu compra!</h2>
            <p className="confirmacion-mensaje">
              Tu pedido ha sido procesado con éxito. A continuación, se muestran los detalles de tu compra:
            </p>
            <div className="confirmacion-detalles-pedido">
              <h3>Detalles del Pedido</h3>
              {ultimoPedido.length > 0 ? (
                <ul className="confirmacion-lista-detalles">
                  {ultimoPedido.map((item) => (
                    <li key={item.id} className="confirmacion-detalle-item">
                      <div className="confirmacion-detalle-titulo">{item.titulo}</div>
                      <div className="confirmacion-detalle-cantidad">Cantidad: {item.cantidad}</div>
                      <div className="confirmacion-detalle-precio">Precio: ${item.precio.toFixed(2)}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No se encontraron detalles del pedido.</p>
              )}
              <div className="confirmacion-resumen-total">
                <span>Total:</span>
                <span>${ultimoTotal}</span>
              </div>
            </div>
            <button className="confirmacion-boton-volver" onClick={() => handleNavigation('/productos')}>
              Volver a Productos
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

