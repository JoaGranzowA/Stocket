import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Home, Apple, Users, ShoppingCart, BarChart2, Lightbulb, Settings, LogOut, MessageCircle, ShoppingBag, Star } from 'lucide-react';
import { ACCESS_TOKEN } from '../constants';
import "../styles/ProductoDetalle.css";

export default function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [currentPage, setCurrentPage] = useState('/producto');
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    fetch(`http://localhost:8000/api/producto/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar el producto');
        }
        return response.json();
      })
      .then((data) => setProducto(data))
      .catch((error) => console.error('Error al cargar producto:', error));

    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);
  }, [id]);

  const handleAgregarAlCarrito = () => {
    if (!producto) return;

    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
    const productoExistente = carritoActual.find((item) => item.id === producto.id);

    if (productoExistente) {
      const nuevoCarrito = carritoActual.map((item) =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
      localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
      setCarrito(nuevoCarrito);
    } else {
      const nuevoProducto = { ...producto, cantidad: 1 };
      const nuevoCarrito = [...carritoActual, nuevoProducto];
      localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
      setCarrito(nuevoCarrito);
    }

    alert('Producto agregado al carrito');
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

  if (!producto) {
    return <div>Cargando producto...</div>;
  }

  const precio = producto.precio ? producto.precio.toFixed(2) : 'N/A';
  const rating = producto.rating ? producto.rating.toFixed(1) : 'N/A';

  return (
    <div className="productos-home-container">
      <aside className="productos-sidebar">
        <div className="productos-logo-container">
          <h1 className="productos-logo">Stocket</h1>
        </div>
        
        <nav className="productos-sidebar-nav">
          {sidebarSections.map((section, index) => (
            <div key={index} className="productos-nav-section">
              <h2 className="productos-nav-section-title">{section.title}</h2>
              {section.items.map((item) => (
                <button
                  key={item.name}
                  className={`productos-nav-item ${currentPage === item.path ? 'productos-active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="productos-nav-icon" />
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="productos-main-content">
        <header className="productos-navbar">
          <div className="productos-navbar-container">
            <h1 className="productos-navbar-title"></h1>
            <div className="productos-navbar-actions">
              <button className="productos-navbar-button" onClick={() => navigate("/chat")}>
                <MessageCircle className="productos-navbar-icon" />
              </button>
              <button className="productos-navbar-button" onClick={handleVerCarrito}>
                <ShoppingBag className="productos-navbar-icon" />
                <span className="productos-carrito-count">{carrito.length}</span>
              </button>
            </div>
          </div>
        </header>

        <main className="productos-page-content">
          <div className="productos-content-container">
            <div className="producto-detalle-card">
              <div className="producto-imagen-container">
                {producto.imagen && (
                  <img
                    src={`http://localhost:8000${producto.imagen}`}
                    alt={producto.titulo}
                    className="producto-detalle-imagen"
                  />
                )}
              </div>
              <div className="producto-info-container">
                <h1 className="producto-detalle-titulo">{producto.titulo}</h1>
                {producto.rating && (
                  <div className="producto-rating">
                    {[...Array(5)].map((_, index) => (
                      <Star key={index} className={index < Math.floor(producto.rating) ? "star-filled" : "star-empty"} />
                    ))}
                    <span className="rating-text">({rating})</span>
                  </div>
                )}
                <p className="producto-detalle-precio">${precio}</p>
                <p className="producto-detalle-vendedor">Vendido y enviado por {producto.vendedor}</p>
                <p className="producto-detalle-stock">Stock Disponible: {producto.stock || 'N/A'}</p>
                <button
                  className="agregar-carrito-boton"
                  onClick={handleAgregarAlCarrito}
                  disabled={producto.stock === 0}
                >
                  {producto.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                </button>
              </div>
            </div>
            <div className="producto-descripcion">
              <h2>Descripción del producto</h2>
              <p>{producto.descripcion || 'No hay descripción disponible'}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}