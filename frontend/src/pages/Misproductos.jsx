import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Package, Lightbulb, ShoppingCart, BarChart2, Settings, MessageCircle, LogOut, DollarSign, Bell, Box, FileText, Plus, Edit, Trash2, AlertTriangle, Upload, CirclePercent} from 'lucide-react';
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
    console.log(`Navigating to ${path}`);
  };

  const handleChatClick = () => {
    console.log("Chat clicked");
  };

  const navItems = [
    { name: 'Inicio', icon: Home, path: '/proveedor/home' },
    { name: 'Mis Productos', icon: Box, path: '/misproductos' },
    { name: 'Gestión de Pedidos', icon: ShoppingCart, path: '/gestionpedidos' },
    { name: 'Facturación y Finanzas', icon: FileText, path: '/finanzas' },
    { name: 'Ofertar', icon:CirclePercent, path: '/verstock' },
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
              Mis Productos
            </a>
            <div className="navbar-actions">
              <button className="navbar-button" onClick={handleChatClick}>
                <MessageCircle className="navbar-icon" />
              </button>
            </div>
          </div>
        </header>

        <main className="page-content">
          <div className="content-container">
            <h2 className="title">Gestión de Productos</h2>
            <button className="boton-agregar" onClick={() => setProductoEditando({ id: null, titulo: '', precio: 0, stock: 0, descripcion: '', imagen: null })}>
              <Plus size={20} style={{ marginRight: '0.5rem' }} />
              Agregar Producto
            </button>
            <div className="productos-grid">
              {productos.map(producto => (
                <div key={producto.id} className="producto-card">
                  {producto.imagen && <img src={`http://localhost:8000${producto.imagen}`} alt={producto.titulo} className="producto-imagen" />}
                  <h3 className="producto-nombre">{producto.titulo}</h3>
                  <p className="producto-precio">Precio: ${producto.precio.toFixed(2)}</p>
                  <p className="producto-stock">
                    Stock: {producto.stock}
                    {producto.stock < 20 && (
                      <AlertTriangle size={16} color="#ef4444" style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />
                    )}
                  </p>
                  <div className="producto-acciones">
                    <button className="boton-accion boton-editar" onClick={() => setProductoEditando(producto)}>
                      <Edit size={20} />
                    </button>
                    <button className="boton-accion boton-eliminar" onClick={() => handleEliminarProducto(producto.id)}>
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
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="title">{productoEditando.id ? 'Editar Producto' : 'Agregar Producto'}</h3>
            <div className="form-group">
              <label className="label" htmlFor="titulo">Nombre</label>
              <input
                className="input"
                type="text"
                id="titulo"
                value={productoEditando.titulo}
                onChange={(e) => setProductoEditando({...productoEditando, titulo: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="precio">Precio</label>
              <input
                className="input"
                type="number"
                id="precio"
                value={productoEditando.precio}
                onChange={(e) => setProductoEditando({...productoEditando, precio: parseFloat(e.target.value)})}
              />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="stock">Stock</label>
              <input
                className="input"
                type="number"
                id="stock"
                value={productoEditando.stock}
                onChange={(e) => setProductoEditando({...productoEditando, stock: parseInt(e.target.value)})}
              />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="descripcion">Descripción</label>
              <textarea
                className="textarea"
                id="descripcion"
                value={productoEditando.descripcion}
                onChange={(e) => setProductoEditando({...productoEditando, descripcion: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="imagen">Imagen</label>
              <input
                className="input"
                type="file"
                id="imagen"
                onChange={(e) => setProductoEditando({...productoEditando, imagen: e.target.files[0]})}
              />
            </div>
            <button className="boton-guardar" onClick={() => productoEditando.id ? handleGuardarProducto(productoEditando) : handleAgregarProducto(productoEditando)}>
              {productoEditando.id ? 'Guardar Cambios' : 'Agregar Producto'}
            </button>
            <button className="boton-cancelar" onClick={() => setProductoEditando(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}


