import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Apple, Users, ShoppingCart, BarChart2, Lightbulb, Settings, LogOut, MessageCircle, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { ACCESS_TOKEN } from '../constants';
import '../styles/Carrito.css';

export default function Carrito() {
  const [currentPage, setCurrentPage] = useState('/carrito');
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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
      const nuevoCarrito = prevCarrito
        .map((item) =>
          item.id === productoId ? { ...item, cantidad: Math.max(0, item.cantidad + cantidad) } : item
        )
        .filter((item) => item.cantidad > 0);
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
      // Agrupar productos por vendedor
      const productosPorVendedor = carrito.reduce((acc, item) => {
        if (!acc[item.vendedor]) {
          acc[item.vendedor] = [];
        }
        acc[item.vendedor].push({
          id: item.id,
          cantidad: item.cantidad,
          precio: item.precio,
        });
        return acc;
      }, {});

      // Crear pedidos para cada proveedor
      const pedidos = Object.keys(productosPorVendedor).map((vendedor) => ({
        vendedor,
        productos: productosPorVendedor[vendedor],
        total: productosPorVendedor[vendedor].reduce(
          (sum, item) => sum + item.precio * item.cantidad,
          0
        ).toFixed(2),
      }));

      // Enviar cada pedido al backend
      for (const pedido of pedidos) {
        const res = await fetch('http://localhost:8000/api/compras/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            vendedor: pedido.vendedor,
            productos: pedido.productos,
            total: pedido.total,
          }),
        });

        if (!res.ok) {
          throw new Error(`Error al completar la compra para el vendedor ${pedido.vendedor}`);
        }
      }

      // Limpiar el carrito y navegar a la página de confirmación
      localStorage.setItem('ultimoPedido', JSON.stringify(carrito));
      localStorage.setItem('ultimoTotal', calcularTotal());
      setCarrito([]);
      localStorage.removeItem('carrito');
      navigate('/confirmacion');
    } catch (error) {
      console.error('Error al completar la compra:', error);
    }
  };

  const handleNavigation = (path) => {
    setCurrentPage(path);
    navigate(path);
  };

  const sidebarSections = [
    {
      title: 'Panel de Control',
      items: [
        { name: 'Panel Principal', icon: Home, path: '/vendedor/home' },
        { name: 'Catálogo de Productos', icon: Apple, path: '/productos' },
        { name: 'Nuestros Proveedores', icon: Users, path: '/proveedores' },
      ],
    },
    {
      title: 'Gestión y Operaciones',
      items: [
        { name: 'Mis Pedidos', icon: ShoppingCart, path: '/pedidos' },
        { name: 'Reportes de Ventas', icon: BarChart2, path: '/analisis' },
        { name: 'Recomendaciones', icon: Lightbulb, path: '/recomendaciones' },
      ],
    },
    {
      title: 'Configuración',
      items: [
        { name: 'Ajustes de Perfil', icon: Settings, path: '/perfil' },
        { name: 'Cerrar sesión', icon: LogOut, path: '/logout' },
      ],
    },
  ];

  return (
    <div className="carrito-home-container">
      <aside className="carrito-sidebar">
        <div className="carrito-logo-container">
          <h1 className="carrito-logo">Stocket</h1>
        </div>

        <nav className="carrito-sidebar-nav">
          {sidebarSections.map((section, index) => (
            <div key={index} className="carrito-nav-section">
              <h2 className="carrito-nav-section-title">{section.title}</h2>
              {section.items.map((item) => (
                <button
                  key={item.name}
                  className={`carrito-nav-item ${
                    currentPage === item.path ? 'carrito-active' : ''
                  }`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="carrito-nav-icon" />
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="carrito-main-content">
        <header className="carrito-navbar">
          <div className="carrito-navbar-container">
            <a href="#" className="carrito-navbar-title"></a>
            <div className="carrito-navbar-actions">
              <button className="carrito-navbar-button" onClick={() => handleNavigation('/productos')}>
                <ShoppingCart className="carrito-navbar-icon" />
              </button>
            </div>
          </div>
        </header>

        <main className="carrito-page-content">
          <div className="carrito-content-container">
            <h2 className="carrito-title">Tu Carrito</h2>
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
                            className="carrito-imagen"
                          />
                        )}
                      </div>
                      <div className="item-detalles">
                        <h3>{item.titulo}</h3>
                        <p className="item-precio">Precio: ${item.precio.toFixed(2)}</p>
                        <p className="item-vendedor">Vendedor: {item.vendedor}</p>
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
