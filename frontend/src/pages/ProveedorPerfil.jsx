import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Home, Users, Package, Lightbulb, ShoppingCart, Box, FileText, Settings, LogOut, BarChart2 } from 'lucide-react';
import { ACCESS_TOKEN } from '../constants';
import '../styles/ProveedorPerfil.css';

export default function ProveedorPerfil() {
  const { id } = useParams();
  const [proveedor, setProveedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('/proveedores');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
      console.error('No hay token disponible');
      navigate('/login');
      return;
    }

    fetch(`http://localhost:8000/api/proveedor/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch provider profile');
        }
        return response.json();
      })
      .then((data) => {
        setProveedor(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching provider profile:', error);
        setLoading(false);
      });
  }, [id, navigate]);

  const navItems = [
    { name: 'Inicio', icon: Home, path: '/vendedor/home' },
    { name: 'Productos', icon: Package, path: '/productos' },
    { name: 'Proveedores', icon: Users, path: '/proveedores' },
    { name: 'Recomendaciones', icon: Lightbulb, path: '/recomendaciones' },
    { name: 'Pedidos', icon: ShoppingCart, path: '/pedidos' },
    { name: 'Análisis', icon: BarChart2, path: '/analisis' },
    { name: 'Configuración', icon: Settings, path: '/perfil' },
    { name: 'Cerrar sesión', icon: LogOut, path: '/logout' },
  ];

  const handleContactClick = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
      console.error('No hay token disponible');
      navigate('/login');
      return;
    }

    // Crear el mensaje predeterminado
    const mensajeData = {
      destinatario: proveedor.user.id,
      contenido: 'Hola, estoy interesado en tus productos y me gustaría saber más detalles.',
    };

    // Enviar el mensaje al proveedor
    fetch('http://localhost:8000/api/mensajes/enviar/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(mensajeData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
        return response.json();
      })
      .then(() => {
        // Redirigir al chat después de enviar el mensaje
        navigate('/chat');
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!proveedor) {
    return <p>Error al cargar el perfil del proveedor.</p>;
  }

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
            <h1 className="navbar-title">Perfil del Proveedor</h1>
          </div>
        </header>
        <main className="page-content">
          <div className="proveedor-perfil-container">
            <div className="proveedor-info-section">
              <h1>Perfil del Proveedor</h1>
              <div className="proveedor-info">
                <img
                  src={proveedor.profile.foto ? `http://localhost:8000${proveedor.profile.foto}` : '/images/default-profile.png'}
                  alt={`Foto de ${proveedor.user.username}`}
                  className="proveedor-photo"
                />
                <h2>{proveedor.user.username}</h2>
                <p><strong>Email:</strong> {proveedor.user.email}</p>
                <p><strong>Ubicación:</strong> {proveedor.profile.ubicacion || 'No especificada'}</p>
                <p><strong>Descripción:</strong> {proveedor.profile.descripcion || 'No especificada'}</p>
                <button className="contact-button" onClick={handleContactClick}>
                  Contactar Proveedor
                </button>
              </div>
            </div>

            <div className="proveedor-productos-section">
              <h2>Productos Ofrecidos</h2>
              {proveedor.productos.length > 0 ? (
                <ul className="productos-lista">
                  {proveedor.productos.map((producto, index) => (
                    <li key={index} className="producto-card">
                      <h3>{producto.nombre}</h3>
                      <p>{producto.descripcion}</p>
                      <p><strong>Precio:</strong> ${producto.precio}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Este proveedor no tiene productos disponibles.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

