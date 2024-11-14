import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Home, Apple, Users, ShoppingCart, BarChart2, Lightbulb, Settings, LogOut, MessageCircle, Star } from 'lucide-react';
import { ACCESS_TOKEN } from '../constants';
import '../styles/ProveedorPerfil.css';

export default function ProveedorPerfil() {
  const { id } = useParams();
  const [proveedor, setProveedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [haComprado, setHaComprado] = useState(false);
  const [nuevaCalificacion, setNuevaCalificacion] = useState(0);
  const [nuevoComentario, setNuevoComentario] = useState('');
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

    fetch(`http://localhost:8000/api/compras/proveedor/${id}/verificar/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to verify purchase');
        }
        return response.json();
      })
      .then((data) => {
        setHaComprado(data.ya_comprado);
      })
      .catch((error) => {
        console.error('Error verifying purchase:', error);
      });
  }, [id, navigate]);

  const handleContactClick = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
      console.error('No hay token disponible');
      navigate('/login');
      return;
    }

    const mensajeData = {
      destinatario: proveedor.user.id,
      contenido: 'Hola, estoy interesado en tus productos y me gustaría saber más detalles.',
    };

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
        navigate('/chat');
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  };

  const handleCalificarProveedor = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    fetch(`http://localhost:8000/api/proveedor/${id}/calificar/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        puntuacion: nuevaCalificacion,
        comentario: nuevoComentario,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to submit rating');
        }
        return response.json();
      })
      .then(() => {
        alert('Calificación enviada con éxito');
        setNuevaCalificacion(0);
        setNuevoComentario('');
        setLoading(true);
        fetch(`http://localhost:8000/api/proveedor/${id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setProveedor(data);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error('Error submitting rating:', error);
      });
  };

  const handleVerProducto = (productoId) => {
    navigate(`/producto/${productoId}`);
  };

  const handleNavigation = (path) => {
    setCurrentPage(path);
    navigate(path);
  };

  if (loading) {
    return <p className="loading-message-proveedor">Cargando...</p>;
  }

  if (!proveedor) {
    return <p className="error-message-proveedor">Error al cargar el perfil del proveedor.</p>;
  }

  const calcularPromedioCalificaciones = () => {
    if (proveedor.calificaciones.length === 0) return 0;
    const suma = proveedor.calificaciones.reduce((acc, cal) => acc + cal.puntuacion, 0);
    return (suma / proveedor.calificaciones.length).toFixed(1);
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
    <div className="productos-home-container-proveedor">
      <aside className="productos-sidebar-proveedor">
        <div className="productos-logo-container-proveedor">
          <h1 className="productos-logo-proveedor">Stocket</h1>
        </div>
        
        <nav className="productos-sidebar-nav-proveedor">
          {sidebarSections.map((section, index) => (
            <div key={index} className="productos-nav-section-proveedor">
              <h2 className="productos-nav-section-title-proveedor">{section.title}</h2>
              {section.items.map((item) => (
                <button
                  key={item.name}
                  className={`productos-nav-item-proveedor ${currentPage === item.path ? 'productos-active-proveedor' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="productos-nav-icon-proveedor" />
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="productos-main-content-proveedor">
        <header className="productos-navbar-proveedor">
          <div className="productos-navbar-container-proveedor">
            <h1 className="productos-navbar-title-proveedor"></h1>
          </div>
        </header>

        <main className="productos-page-content-proveedor">
          <div className="proveedor-perfil-container-proveedor">
            <section className="proveedor-info-section-proveedor">
              <h2>Información del Proveedor</h2>
              <div className="proveedor-info-proveedor">
                <img
                  src={proveedor.profile.foto ? `http://localhost:8000${proveedor.profile.foto}` : '/images/default-profile.png'}
                  alt={`Foto de ${proveedor.user.username}`}
                  className="proveedor-photo-proveedor"
                />
                <h3>{proveedor.user.username}</h3>
                <p><strong>Email:</strong> {proveedor.user.email}</p>
                <p><strong>Ubicación:</strong> {proveedor.profile.ubicacion || 'No especificada'}</p>
                <p><strong>Descripción:</strong> {proveedor.profile.descripcion || 'No especificada'}</p>
                <div className="calificacion-promedio-proveedor">
                  <p><strong>Calificación promedio:</strong></p>
                  <div className="estrellas-proveedor">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`estrella-proveedor ${star <= Math.round(calcularPromedioCalificaciones()) ? 'filled-proveedor' : ''}`}
                      />
                    ))}
                  </div>
                  <span>{calcularPromedioCalificaciones()} / 5</span>
                </div>
                <button className="contact-button-proveedor" onClick={handleContactClick}>
                  <MessageCircle className="button-icon-proveedor" />
                  Contactar Proveedor
                </button>
              </div>
            </section>

            {haComprado && (
              <section className="calificar-proveedor-section-proveedor">
                <h2>Calificar al Proveedor</h2>
                <div className="calificar-form-proveedor">
                  <label>Puntuación:</label>
                  <div className="estrellas-seleccion-proveedor">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`estrella-proveedor ${star <= nuevaCalificacion ? 'filled-proveedor' : ''}`}
                        onClick={() => setNuevaCalificacion(star)}
                      />
                    ))}
                  </div>
                  <label htmlFor="comentario">Comentario:</label>
                  <textarea
                    id="comentario"
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                    placeholder="Escribe tu comentario..."
                  />
                  <button className="calificar-button-proveedor" onClick={handleCalificarProveedor}>
                    Enviar Calificación
                  </button>
                </div>
              </section>
            )}

            <section className="proveedor-productos-section-proveedor">
              <h2>Productos Ofrecidos</h2>
              {proveedor.productos.length > 0 ? (
                <div className="productos-grid-proveedor">
                  {proveedor.productos.map((producto, index) => (
                    <div key={index} className="producto-card-proveedor">
                      {producto.imagen && (
                        <img
                          src={`http://localhost:8000${producto.imagen}`}
                          alt={producto.titulo}
                          className="producto-imagen-proveedor"
                          onClick={() => handleVerProducto(producto.id)}
                        />
                      )}
                      <div className="producto-card-content-proveedor">
                        <h3 className="producto-titulo-proveedor">{producto.titulo}</h3>
                        <p className="producto-descripcion-proveedor">{producto.descripcion}</p>
                        <p className="producto-precio-proveedor"><strong>Precio:</strong> ${producto.precio}</p>
                        <button
                          className="producto-boton-ver-proveedor"
                          onClick={() => handleVerProducto(producto.id)}
                        >
                          Ver Producto
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Este proveedor no tiene productos disponibles.</p>
              )}
            </section>

            <section className="proveedor-calificaciones-section-proveedor">
              <h2>Calificaciones de los Compradores</h2>
              {proveedor.calificaciones.length > 0 ? (
                <div className="calificaciones-lista-proveedor">
                  {proveedor.calificaciones.map((calificacion, index) => (
                    <div key={index} className="calificacion-card-proveedor">
                      <div className="calificacion-info-proveedor">
                        <div className="estrellas-proveedor">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`estrella-proveedor ${star <= calificacion.puntuacion ? 'filled-proveedor' : ''}`}
                            />
                          ))}
                        </div>
                        <span className="calificacion-puntuacion-proveedor">{calificacion.puntuacion} / 5</span>
                      </div>
                      <p className="calificacion-comentario-proveedor">{calificacion.comentario || 'Sin comentarios'}</p>
                      <p className="calificacion-fecha-proveedor">Fecha: {new Date(calificacion.fecha).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Este proveedor aún no tiene calificaciones.</p>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}