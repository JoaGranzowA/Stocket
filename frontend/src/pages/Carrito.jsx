import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Apple, Boxes, Lightbulb, ShoppingCart, BarChart2, Settings, MessageCircle, ShoppingBag, LogOut, Minus, Plus, Trash2 } from 'lucide-react';
import { ACCESS_TOKEN } from '../constants';
import "../styles/Carrito.css"

export default function Carrito() {
  const [currentPage, setCurrentPage] = useState('/carrito');
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar el carrito de localStorage cuando el componente se monta
    try {
      const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
      if (carritoGuardado.length > 0) {
        console.log('Carrito cargado:', carritoGuardado);
        setCarrito(carritoGuardado);
      }
    } catch (error) {
      console.error('Error al cargar el carrito desde localStorage:', error);
    }
  }, []);

  const actualizarCantidad = (productoId, cantidad) => {
    setCarrito((prevCarrito) => {
      const nuevoCarrito = prevCarrito.map((item) =>
        item.id === productoId
          ? { ...item, cantidad: Math.max(0, item.cantidad + cantidad) }
          : item
      ).filter((item) => item.cantidad > 0);
      localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
      return nuevoCarrito;
    });
  };

  const eliminarProducto = (productoId) => {
    setCarrito((prevCarrito) => {
      const nuevoCarrito = prevCarrito.filter((item) => item.id !== productoId);
      localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
      return nuevoCarrito;
    });
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error('No hay token disponible');
      return;
    }

    try {
      const productos = carrito.map((item) => ({
        id: item.id,
        cantidad: item.cantidad
      }));

      const res = await fetch('http://localhost:8000/api/compras/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productos, total: calcularTotal() }),
      });

      if (!res.ok) {
        throw new Error('Error al completar la compra');
      }
      localStorage.setItem('ultimoPedido', JSON.stringify(carrito));
      localStorage.setItem('ultimoTotal', calcularTotal());
      // Limpiar el carrito después de una compra exitosa
      setCarrito([]);
      localStorage.removeItem('carrito');
      // Redirigir a una página de confirmación
      navigate('/confirmacion');
    } catch (error) {
      console.error('Error al completar la compra:', error);
    }
  };

  const handleNavigation = (path) => {
    setCurrentPage(path);
    navigate(path);
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
              onClick={() => handleNavigation(item.path)}
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
            <a href="#" className="navbar-title">
              Carrito de Compras
            </a>
            <div className="navbar-actions">
              <button className="navbar-button" onClick={() => handleNavigation('/productos')}>
                <ShoppingCart className="navbar-icon" />
                Seguir Comprando
              </button>
            </div>
          </div>
        </header>

        <main className="page-content">
          <div className="content-container">
            <h2 className="title">Tu Carrito</h2>
            {carrito.length === 0 ? (
              <p className="carrito-vacio">Tu carrito está vacío.</p>
            ) : (
              <div className="carrito-contenido">
                <ul className="carrito-lista">
                  {carrito.map((item) => (
                    <li key={item.id} className="carrito-item">
                      <div className="item-imagen">
                        {item.imagen && (
                          <img
                            src={`http://localhost:8000${item.imagen}`}
                            alt={item.titulo}
                            className="producto-imagen"
                          />
                        )}
                      </div>
                      <div className="item-detalles">
                        <h3>{item.titulo}</h3>
                        <p className="item-precio">${item.precio.toFixed(2)}</p>
                      </div>
                      <div className="item-cantidad">
                        <button onClick={() => actualizarCantidad(item.id, -1)}>
                          <Minus size={16} />
                        </button>
                        <span>{item.cantidad}</span>
                        <button onClick={() => actualizarCantidad(item.id, 1)}>
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="item-total">
                        ${(item.precio * item.cantidad).toFixed(2)}
                      </div>
                      <button className="item-eliminar" onClick={() => eliminarProducto(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="carrito-resumen">
                  <h3>Resumen del Pedido</h3>
                  <div className="resumen-total">
                    <span>Total:</span>
                    <span>${calcularTotal()}</span>
                  </div>
                  <button className="boton-checkout" onClick={handleCheckout}>
                    Proceder al Pago
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
