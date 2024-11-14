import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Apple, Boxes, Lightbulb, ShoppingCart, Box, FileText, Settings, LogOut, BarChart2, MessageCircle, ShoppingBag, CirclePercent, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { ACCESS_TOKEN } from '../constants';
import "../styles/Misproductos.css"

export default function ProductosProveedor() {
  const [currentPage, setCurrentPage] = useState('/misproductos');
  const [productos, setProductos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    console.log('Token de autenticación:', token);

    fetch('http://localhost:8000/api/productos/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }
        return response.json();
      })
      .then((data) => setProductos(data))
      .catch((error) => console.error('Error al cargar productos:', error));
  }, []);

  const handleAgregarProducto = (producto) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error('No hay token disponible');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', producto.titulo);
    formData.append('precio', producto.precio);
    formData.append('stock', producto.stock);
    formData.append('descripcion', producto.descripcion);
    if (producto.imagen) {
      formData.append('imagen', producto.imagen);
    }

    console.log('Intentando agregar producto:', producto);

    fetch('http://localhost:8000/api/productos/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        console.log('Respuesta del servidor:', response);
        if (!response.ok) {
          return response.json().then((errorData) => {
            console.error('Error al agregar producto:', errorData);
            throw new Error('Error al agregar producto');
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Producto agregado:', data);
        setProductos([...productos, data]);
        setProductoEditando(null);
      })
      .catch((error) => console.error('Error al agregar producto:', error));
  };

  const handleGuardarProducto = (producto) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error('No hay token disponible');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', producto.titulo);
    formData.append('precio', producto.precio);
    formData.append('stock', producto.stock);
    formData.append('descripcion', producto.descripcion);
    if (producto.imagen) {
      formData.append('imagen', producto.imagen);
    }

    fetch(`http://localhost:8000/api/productos/${producto.id}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            console.error('Error al guardar producto:', errorData);
            throw new Error('Error al guardar producto');
          });
        }
        return response.json();
      })
      .then(() => {
        setProductos((prevProductos) => prevProductos.map((p) => (p.id === producto.id ? producto : p)));
        setProductoEditando(null);
      })
      .catch((error) => console.error('Error al guardar producto:', error));
  };

  const handleEliminarProducto = (id) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error('No hay token disponible');
      return;
    }

    fetch(`http://localhost:8000/api/productos/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            console.error('Error al eliminar producto:', errorData);
            throw new Error('Error al eliminar producto');
          });
        }
        return response.json();
      })
      .then(() => {
        setProductos((prevProductos) => prevProductos.filter((producto) => producto.id !== id));
      })
      .catch((error) => console.error('Error al eliminar producto:', error));
  };

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

  return (
    <div className="mp-container">
      <aside className="mp-sidebar">
        <div className="mp-logo-container">
          <h1 className="mp-logo">Stocket</h1>
        </div>
        <nav className="mp-sidebar-nav">
          {sidebarSections.map((section, index) => (
            <div key={index} className="mp-nav-section">
              <h2 className="mp-nav-section-title">{section.title}</h2>
              {section.items.map((item) => (
                <button
                  key={item.name}
                  className={`mp-nav-item ${currentPage === item.path ? 'mp-active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="mp-nav-icon" />
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="mp-main-content">
        <header className="mp-navbar">
          <div className="mp-navbar-container">
            <h1 className="mp-navbar-title"></h1>
            <div className="mp-navbar-actions">
              <button className="mp-navbar-button" onClick={() => navigate("/chat")}>
                <MessageCircle className="mp-navbar-icon" />
              </button>
              <button className="mp-navbar-button" onClick={() => navigate("/carrito")}>
              </button>
            </div>
          </div>
        </header>

        <main className="mp-page-content">
          <div className="mp-content-container">
            <h2 className="mp-title">Gestión de Productos</h2>
            <button className="mp-boton-agregar" onClick={() => setProductoEditando({ id: null, titulo: '', precio: 0, stock: 0, descripcion: '', imagen: null })}>
              <Plus size={20} style={{ marginRight: '0.5rem' }} />
              Agregar Producto
            </button>
            <div className="mp-productos-grid">
              {productos.map(producto => (
                <div key={producto.id} className="mp-producto-card">
                  {producto.imagen && <img src={`http://localhost:8000${producto.imagen}`} alt={producto.titulo} className="mp-producto-imagen" />}
                  <h3 className="mp-producto-nombre">{producto.titulo}</h3>
                  <p className="mp-producto-precio">Precio: ${producto.precio.toFixed(2)}</p>
                  <p className="mp-producto-stock">
                    Stock: {producto.stock}
                    {producto.stock < 20 && (
                      <AlertTriangle size={16} color="#ef4444" style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />
                    )}
                  </p>
                  <div className="mp-producto-acciones">
                    <button className="mp-boton-accion mp-boton-editar" onClick={() => setProductoEditando(producto)}>
                      <Edit size={20} />
                    </button>
                    <button className="mp-boton-accion mp-boton-eliminar" onClick={() => handleEliminarProducto(producto.id)}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {productoEditando && (
        <div className="mp-modal-overlay">
          <div className="mp-modal-content">
            <h3 className="mp-title">{productoEditando.id ? 'Editar Producto' : 'Agregar Producto'}</h3>
            <div className="mp-form-group">
              <label className="mp-label" htmlFor="titulo">Nombre</label>
              <input
                className="mp-input"
                type="text"
                id="titulo"
                value={productoEditando.titulo}
                onChange={(e) => setProductoEditando({...productoEditando, titulo: e.target.value})}
              />
            </div>
            <div className="mp-form-group">
              <label className="mp-label" htmlFor="precio">Precio</label>
              <input
                className="mp-input"
                type="number"
                id="precio"
                value={productoEditando.precio}
                onChange={(e) => setProductoEditando({...productoEditando, precio: parseFloat(e.target.value)})}
              />
            </div>
            <div className="mp-form-group">
              <label className="mp-label" htmlFor="stock">Stock</label>
              <input
                className="mp-input"
                type="number"
                id="stock"
                value={productoEditando.stock}
                onChange={(e) => setProductoEditando({...productoEditando, stock: parseInt(e.target.value)})}
              />
            </div>
            <div className="mp-form-group">
              <label className="mp-label" htmlFor="descripcion">Descripción</label>
              <textarea
                className="mp-textarea"
                id="descripcion"
                value={productoEditando.descripcion}
                onChange={(e) => setProductoEditando({...productoEditando, descripcion: e.target.value})}
              />
            </div>
            <div className="mp-form-group">
              <label className="mp-label" htmlFor="imagen">Imagen</label>
              <input
                className="mp-input"
                type="file"
                id="imagen"
                onChange={(e) => setProductoEditando({...productoEditando, imagen: e.target.files[0]})}
              />
            </div>
            <button className="mp-boton-guardar" onClick={() => productoEditando.id ? handleGuardarProducto(productoEditando) : handleAgregarProducto(productoEditando)}>
              {productoEditando.id ? 'Guardar Cambios' : 'Agregar Producto'}
            </button>
            <button className="mp-boton-cancelar" onClick={() => setProductoEditando(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}