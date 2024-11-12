import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Apple, Boxes, Lightbulb, ShoppingCart, Box, FileText, Settings, LogOut, BarChart2, Send, CirclePercent } from 'lucide-react';
import { ACCESS_TOKEN } from '../constants';
import '../styles/Chat.css';

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [currentPage, setCurrentPage] = useState('/chat');
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [chatSeleccionado, setChatSeleccionado] = useState(null);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const navItemsCustomer = [
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

  const navItemsEmployee = [
    { name: 'Inicio', icon: Home, path: '/proveedor/home' },
    { name: 'Mis Productos', icon: Box, path: '/misproductos' },
    { name: 'Gestión de Pedidos', icon: ShoppingCart, path: '/gestionpedidos' },
    { name: 'Facturación y Finanzas', icon: FileText, path: '/finanzas' },
    { name: 'Ofertar', icon:CirclePercent, path: '/verstock' },
    { name: 'Configuración', icon: Settings, path: '/perfil' },
    { name: 'Cerrar sesión', icon: LogOut, path: '/logout' },
  ];

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error('No hay token disponible');
      navigate('/login');
      return;
    }

    // Fetch para obtener los datos del usuario actual
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
        setUsuarioActual(data.user);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar el perfil del usuario:', error);
        setLoading(false);
      });

    // Fetch para obtener los chats anteriores
    fetch('http://localhost:8000/api/chats/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar los chats anteriores');
        }
        return response.json();
      })
      .then((data) => {
        setChats(data);
      })
      .catch((error) => {
        console.error('Error al cargar los chats anteriores:', error);
      });
  }, [navigate]);

  const navItems = usuarioActual?.is_employee ? navItemsEmployee : navItemsCustomer;

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!usuarioActual) {
    return <p>Error al cargar el perfil del usuario.</p>;
  }

  const handleSelectChat = (chatId) => {
    setChatSeleccionado(chatId);
    if (chats[chatId]) {
      setMensajes(chats[chatId].mensajes);
    }
  };

  const handleEnviarMensaje = () => {
    if (!nuevoMensaje.trim() || !chatSeleccionado) {
      console.error('El mensaje está vacío o no hay chat seleccionado');
      return;
    }

    const token = localStorage.getItem(ACCESS_TOKEN);
    const mensajeData = {
      contenido: nuevoMensaje,
      destinatario: chatSeleccionado,
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
          throw new Error('Error al enviar el mensaje');
        }
        return response.json();
      })
      .then((data) => {
        setMensajes([
          ...mensajes,
          {
            remitente: usuarioActual.username,
            contenido: nuevoMensaje,
            timestamp: new Date().toLocaleString(),
          },
        ]);
        setNuevoMensaje('');
      })
      .catch((error) => console.error('Error al enviar el mensaje:', error));
  };

  return (
    <div className="stocket-chat-container">
      <aside className="stocket-chat-sidebar">
        <div className="stocket-chat-logo-container">
          <h1 className="stocket-chat-logo">Stocket</h1>
        </div>
        <nav className="stocket-chat-sidebar-nav">
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

      <div className="stocket-chat-main-content">
        <header className="stocket-chat-navbar">
          <div className="stocket-chat-navbar-container">
            <h1 className="stocket-chat-navbar-title">Chat</h1>
          </div>
        </header>

        <main className="stocket-chat-page-content">
          <div className="stocket-chat-content-container">
            <div className="stocket-chat-interface">
              <div className="stocket-chat-conversation-list">
                <h2 className="stocket-chat-section-title">Chats Anteriores</h2>
                <ul>
                  {Object.keys(chats).map((chatId) => (
                    <li
                      key={chatId}
                      className={`stocket-chat-conversation-item ${chatSeleccionado === chatId ? 'stocket-chat-item-seleccionado' : ''}`}
                      onClick={() => handleSelectChat(chatId)}
                    >
                      <div className="stocket-chat-conversation-avatar">
                        {chats[chatId].usuario[0]}
                      </div>
                      <div className="stocket-chat-conversation-info">
                        <h3 className="stocket-chat-conversation-name">
                          {chats[chatId].usuario}
                        </h3>
                        <p className="stocket-chat-conversation-last-message">
                          Último mensaje...
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="stocket-chat-window">
                <div className="stocket-chat-messages">
                  {mensajes.length > 0 ? (
                    mensajes.map((mensaje, index) => (
                      <div
                        key={index}
                        className={`stocket-chat-message ${
                          mensaje.remitente === usuarioActual.username ? 'sent' : 'received'
                        }`}
                      >
                        <p className="stocket-chat-message-content">{mensaje.contenido}</p>
                        <span className="stocket-chat-message-timestamp">
                          {mensaje.timestamp}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>No hay mensajes anteriores disponibles.</p>
                  )}
                </div>
                <div className="stocket-chat-input-container">
                  <input
                    type="text"
                    className="stocket-chat-input"
                    placeholder="Escribe tu mensaje..."
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                  />
                  <button onClick={handleEnviarMensaje} className="stocket-chat-send-button">
                    <Send size={20} className="stocket-chat-send-icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

