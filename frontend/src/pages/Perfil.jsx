import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Package, Lightbulb, ShoppingCart, Box, FileText, Settings, LogOut, BarChart2, MessageCircle, ShoppingBag, Send } from 'lucide-react';
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
    navigate(path);
  };

  const navItemsCustomer = [
    { name: 'Inicio', icon: Home, path: '/vendedor/home' },
    { name: 'Productos', icon: Package, path: '/productos' },
    { name: 'Recomendaciones', icon: Lightbulb, path: '/recomendaciones' },
    { name: 'Pedidos', icon: ShoppingCart, path: '/pedidos' },
    { name: 'Análisis', icon: BarChart2, path: '/analisis' },
    { name: 'Configuración', icon: Settings, path: '/perfil' },
    { name: 'Cerrar sesión', icon: LogOut, path: '/logout' },
  ];

  const navItemsEmployee = [
    { name: 'Inicio', icon: Home, path: '/proveedor/home' },
    { name: 'Mis Productos', icon: Box, path: '/misproductos' },
    { name: 'Gestión de Pedidos', icon: ShoppingCart, path: '/pedidos' },
    { name: 'Facturación y Finanzas', icon: FileText, path: '/finanzas' },
    { name: 'Configuración', icon: Settings, path: '/perfil' },
    { name: 'Cerrar sesión', icon: LogOut, path: '/logout' },
  ];

  const navItems = userProfile?.user?.is_employee ? navItemsEmployee : navItemsCustomer;

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!userProfile) {
    return <p>Error al cargar el perfil del usuario.</p>;
  }

  const { user, profile } = userProfile;

  return (
    <div className="chat-container">
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
              Perfil del Usuario
            </a>
          </div>
        </header>

        <main className="page-content">
          <div className="content-container">
            <div className="user-profile-container">
              <h1>Perfil del Usuario</h1>
              <div className="profile-card">
                {!editMode ? (
                  <>
                    <div className="profile-header">
                      {profile && profile.foto && (
                        <div className="profile-photo">
                          <img src={`http://localhost:8000${profile.foto}`} alt="Foto de perfil" />
                        </div>
                      )}
                      <h2>{user.username}</h2>
                    </div>
                    <div className="profile-info">
                      <h3>Información del Usuario</h3>
                      <p><strong>Email:</strong> {user.email}</p>
                    </div>
                    {profile && (
                      <div className="profile-details">
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
                    <button onClick={() => setEditMode(true)} className="edit-profile-button">
                      Editar Perfil
                    </button>
                  </>
                ) : (
                  <>
                    <div className="edit-profile-form">
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
                      
                      <div className="button-group">
                        <button onClick={handleSaveProfile} className="save-profile-button">
                          Guardar Cambios
                        </button>
                        <button onClick={() => setEditMode(false)} className="cancel-edit-button">
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
