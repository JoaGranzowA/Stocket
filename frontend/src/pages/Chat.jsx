import React, { useState } from 'react';
import { Home, Users, Package, Lightbulb, ShoppingCart, BarChart2, LogOut, MessageCircle, ShoppingBag, Send, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "../styles/Chat.css"

export default function ChatPage() {
  const [currentPage, setCurrentPage] = useState('/chat');
  const [selectedChat, setSelectedChat] = useState(null);
  const navigate = useNavigate();

  const conversations = [
    { id: 1, name: 'Juan Pérez', lastMessage: 'Gracias por tu pedido', unread: 2 },
    { id: 2, name: 'María García', lastMessage: '¿Tienes stock disponible?', unread: 0 },
    { id: 3, name: 'Carlos Rodríguez', lastMessage: 'El envío llegó perfectamente', unread: 1 },
  ];

  const messages = [
    { id: 1, sender: 'Juan Pérez', content: 'Hola, ¿cómo estás?', timestamp: '10:30 AM' },
    { id: 2, sender: 'Tú', content: '¡Hola Juan! Estoy bien, gracias. ¿En qué puedo ayudarte?', timestamp: '10:32 AM' },
    { id: 3, sender: 'Juan Pérez', content: 'Quería consultar sobre mi último pedido', timestamp: '10:35 AM' },
  ];

  const navItems = [
    { name: 'Inicio', icon: Home, path: '/vendedor/home' },
    { name: 'Productos', icon: Package, path: '/productos' },
    { name: 'Recomendaciones', icon: Lightbulb, path: '/recomendaciones' },
    { name: 'Pedidos', icon: ShoppingCart, path: '/pedidos' },
    { name: 'Análisis', icon: BarChart2, path: '/analisis' },
    { name: 'Configuración', icon: Settings, path: '/datos' },
    { name: 'Cerrar sesión', icon: LogOut, path: '/logout' },
  ];

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

      {/* Main content */}
      <div className="main-content">
        {/* Navbar */}
        <header className="navbar">
          <div className="navbar-container">
            <h2 className="navbar-title">Chats</h2>
            <div className="navbar-actions">
              <button className="navbar-button">
                <MessageCircle className="navbar-icon" />
              </button>
              <button className="navbar-button">
                <ShoppingBag className="navbar-icon" />
              </button>
            </div>
          </div>
        </header>

        {/* Chat interface */}
        <main className="chat-interface">
          <div className="conversation-list">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`conversation-item ${selectedChat === conversation.id ? 'active' : ''}`}
                onClick={() => setSelectedChat(conversation.id)}
              >
                <div className="conversation-avatar">{conversation.name[0]}</div>
                <div className="conversation-info">
                  <h3 className="conversation-name">{conversation.name}</h3>
                  <p className="conversation-last-message">{conversation.lastMessage}</p>
                </div>
                {conversation.unread > 0 && (
                  <div className="unread-badge">{conversation.unread}</div>
                )}
              </div>
            ))}
          </div>
          <div className="chat-window">
            {selectedChat ? (
              <>
                <div className="chat-messages">
                  {messages.map((message) => (
                    <div key={message.id} className={`message ${message.sender === 'Tú' ? 'sent' : 'received'}`}>
                      <p className="message-content">{message.content}</p>
                      <span className="message-timestamp">{message.timestamp}</span>
                    </div>
                  ))}
                </div>
                <div className="chat-input">
                  <input type="text" placeholder="Escribe un mensaje..." />
                  <button className="send-button">
                    <Send className="send-icon" />
                  </button>
                </div>
              </>
            ) : (
              <div className="no-chat-selected">
                <p>Selecciona una conversación para comenzar a chatear</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}