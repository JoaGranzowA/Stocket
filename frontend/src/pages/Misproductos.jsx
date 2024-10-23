import React, { useState } from 'react';
import { Home, Users, Package, Lightbulb, ShoppingCart, BarChart2, Settings, MessageCircle, LogOut, DollarSign, Bell, Box, FileText, Plus, Edit, Trash2, AlertTriangle, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "../styles/Misproductos.css"

export default function ProductosProveedor() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('/misproductos');
  const [productos, setProductos] = useState([
    { id: 1, nombre: 'Producto A', precio: 19.99, stock: 50, imagenes: ['/placeholder.svg'], descripcion: 'Descripción del Producto A' },
    { id: 2, nombre: 'Producto B', precio: 29.99, stock: 30, imagenes: ['/placeholder.svg'], descripcion: 'Descripción del Producto B' },
    { id: 3, nombre: 'Producto C', precio: 39.99, stock: 10, imagenes: ['/placeholder.svg'], descripcion: 'Descripción del Producto C' },
  ]);
  const [productoEditando, setProductoEditando] = useState(null);

  const handleNavigation = (path) => {
    setCurrentPage(path);
    console.log(`Navigating to ${path}`);
  };

  const handleChatClick = () => {
    console.log("Chat clicked");
  };

  const handleAgregarProducto = () => {
    const nuevoProducto = {
      id: productos.length + 1,
      nombre: 'Nuevo Producto',
      precio: 0,
      stock: 0,
      imagenes: ['/placeholder.svg'],
      descripcion: 'Descripción del nuevo producto'
    };
    setProductos([...productos, nuevoProducto]);
    setProductoEditando(nuevoProducto);
  };

  const handleEditarProducto = (producto) => {
    setProductoEditando(producto);
  };

  const handleEliminarProducto = (id) => {
    setProductos(productos.filter(p => p.id !== id));
  };

  const handleGuardarProducto = (productoEditado) => {
    setProductos(productos.map(p => p.id === productoEditado.id ? productoEditado : p));
    setProductoEditando(null);
  };

  const navItems = [
    { name: 'Inicio', icon: Home, path: '/proveedor/home' },
    { name: 'Mis Productos', icon: Box, path: '/misproductos' },
    { name: 'Gestión de Pedidos', icon: ShoppingCart, path: '/gestionpedidos' },
    { name: 'Facturación y Finanzas', icon: FileText, path: '/finanzas' },
    { name: 'Configuración', icon: Settings, path: '/datos' },
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
            <button className="boton-agregar" onClick={handleAgregarProducto}>
              <Plus size={20} style={{ marginRight: '0.5rem' }} />
              Agregar Producto
            </button>
            <div className="productos-grid">
              {productos.map(producto => (
                <div key={producto.id} className="producto-card">
                  <img src={producto.imagenes[0]} alt={producto.nombre} className="producto-imagen" />
                  <h3 className="producto-nombre">{producto.nombre}</h3>
                  <p className="producto-precio">Precio: ${producto.precio.toFixed(2)}</p>
                  <p className="producto-stock">
                    Stock: {producto.stock}
                    {producto.stock < 20 && (
                      <AlertTriangle size={16} color="#ef4444" style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />
                    )}
                  </p>
                  <div className="producto-acciones">
                    <button className="boton-accion boton-editar" onClick={() => handleEditarProducto(producto)}>
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
              <label className="label" htmlFor="nombre">Nombre</label>
              <input
                className="input"
                type="text"
                id="nombre"
                value={productoEditando.nombre}
                onChange={(e) => setProductoEditando({...productoEditando, nombre: e.target.value})}
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
              <label className="label">Imágenes</label>
              <button className="boton-accion boton-editar" style={{ width: '100%' }}>
                <Upload size={20} style={{ marginRight: '0.5rem' }} />
                Subir Imágenes
              </button>
            </div>
            <button className="boton-guardar" onClick={() => handleGuardarProducto(productoEditando)}>
              Guardar Producto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}