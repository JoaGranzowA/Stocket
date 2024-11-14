import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Apple, Boxes, Lightbulb, ShoppingCart, Box, FileText, Settings, LogOut, BarChart2, MessageCircle, ShoppingBag, CirclePercent } from 'lucide-react';
import { ACCESS_TOKEN } from '../constants';
import "../styles/Perfil.css";

export default function UserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState('/perfil');
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    ubicacion: '',
    numero_contacto: '',
    descripcion: '',
    rubro: '',
    experiencia: '',
    foto: null,
  });
  const [loading, setLoading] = useState(true);
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error('No hay token disponible');
      navigate('/login');
      return;
    }

    fetch('http://localhost:8000/api/profile/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar el perfil del usuario');
        }
        return response.json();
      })
      .then((data) => {
        setUserProfile(data);
        setProfileData({
          ubicacion: data.profile.ubicacion,
          numero_contacto: data.profile.numero_contacto,
          descripcion: data.profile.descripcion,
          rubro: data.profile.rubro,
          experiencia: data.profile.experiencia,
          foto: data.profile.foto,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar el perfil del usuario:', error);
        setLoading(false);
      });

    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProfileData({ ...profileData, foto: e.target.files[0] });
  };

  const handleSaveProfile = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const formData = new FormData();
    formData.append('ubicacion', profileData.ubicacion);
    formData.append('numero_contacto', profileData.numero_contacto);
    formData.append('descripcion', profileData.descripcion);

    if (userProfile.user.is_employee) {
      if (profileData.rubro) {
        formData.append('rubro', profileData.rubro);
      }
      if (profileData.experiencia) {
        formData.append('experiencia', profileData.experiencia);
      }
    }

    if (profileData.foto instanceof File) {
      formData.append('foto', profileData.foto);
    }

    fetch('http://localhost:8000/api/profile/update/', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al actualizar el perfil');
        }
        return response.json();
      })
      .then((data) => {
        setUserProfile({ ...userProfile, profile: data });
        setEditMode(false);
      })
      .catch((error) => console.error('Error al actualizar el perfil:', error));
  };

  const handleNavigation = (path) => {
    setCurrentPage(path);
    navigate(path);
  };

  const handleVerCarrito = () => {
    navigate('/carrito');
  };

  const sidebarSections = userProfile?.user?.is_employee
    ? [
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
      ]
    : [
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

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!userProfile) {
    return <p>Error al cargar el perfil del usuario.</p>;
  }

  const { user, profile } = userProfile;

  return (
    <div className="perfil-home-container">
      <aside className="perfil-sidebar">
        <div className="perfil-logo-container">
          <h1 className="perfil-logo">Stocket</h1>
        </div>
        <nav className="perfil-sidebar-nav">
          {sidebarSections.map((section, index) => (
            <div key={index} className="perfil-nav-section">
              <h2 className="perfil-nav-section-title">{section.title}</h2>
              {section.items.map((item) => (
                <button
                  key={item.name}
                  className={`perfil-nav-item ${currentPage === item.path ? 'perfil-active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="perfil-nav-icon" />
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="perfil-main-content">
        <header className="perfil-navbar">
          <div className="perfil-navbar-container">
            <h1 className="perfil-navbar-title">
              
            </h1>
            <div className="perfil-navbar-actions">
              <button className="perfil-navbar-button" onClick={() => navigate("/chat")}>
                <MessageCircle className="perfil-navbar-icon" />
              </button>
              <button className="perfil-navbar-button" onClick={handleVerCarrito}>
              </button>
            </div>
          </div>
        </header>

        <main className="perfil-page-content">
          <div className="perfil-content-container">
            <div className="perfil-user-profile-container">
              <h1>Perfil del Usuario</h1>
              <div className="perfil-profile-card">
                {!editMode ? (
                  <>
                    <div className="perfil-profile-header">
                      {profile && profile.foto && (
                        <div className="perfil-profile-photo">
                          <img src={`http://localhost:8000${profile.foto}`} alt="Foto de perfil" />
                        </div>
                      )}
                      <h2>{user.username}</h2>
                    </div>
                    <div className="perfil-profile-info">
                      <h3>Información del Usuario</h3>
                      <p><strong>Email:</strong> {user.email}</p>
                    </div>
                    {profile && (
                      <div className="perfil-profile-details">
                        <h3>Detalles del Perfil</h3>
                        <p><strong>Ubicación:</strong> {profile.ubicacion || 'No especificada'}</p>
                        <p><strong>Número de Contacto:</strong> {profile.numero_contacto || 'No especificado'}</p>
                        <p><strong>Descripción:</strong> {profile.descripcion || 'No especificada'}</p>
                        {user.is_employee && (
                          <>
                            <p><strong>Rubro:</strong> {profile.rubro || 'No especificado'}</p>
                            <p><strong>Experiencia:</strong> {profile.experiencia ? `${profile.experiencia} años` : 'No especificada'}</p>
                          </>
                        )}
                      </div>
                    )}
                    <button onClick={() => setEditMode(true)} className="perfil-edit-profile-button">
                      Editar Perfil
                    </button>
                  </>
                ) : (
                  <>
                    <div className="perfil-edit-profile-form">
                      <h2>Editar Perfil</h2>
                      <label>Foto de Perfil:</label>
                      <input type="file" name="foto" onChange={handleFileChange} />
                      
                      <label>Ubicación:</label>
                      <input type="text" name="ubicacion" value={profileData.ubicacion} onChange={handleInputChange} />
                      
                      <label>Número de Contacto:</label>
                      <input type="text" name="numero_contacto" value={profileData.numero_contacto} onChange={handleInputChange} />
                      
                      <label>Descripción:</label>
                      <textarea name="descripcion" value={profileData.descripcion} onChange={handleInputChange}></textarea>
                      
                      {user.is_employee && (
                        <>
                          <label>Rubro:</label>
                          <input type="text" name="rubro" value={profileData.rubro} onChange={handleInputChange} />
                          
                          <label>Experiencia (años):</label>
                          <input type="number" name="experiencia" value={profileData.experiencia} onChange={handleInputChange} />
                        </>
                      )}
                      
                      <div className="perfil-button-group">
                        <button onClick={handleSaveProfile} className="perfil-save-profile-button">
                          Guardar Cambios
                        </button>
                        <button onClick={() => setEditMode(false)} className="perfil-cancel-edit-button">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
