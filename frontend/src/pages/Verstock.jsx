import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Apple, Boxes, Lightbulb, ShoppingCart, Box, FileText, Settings, LogOut, BarChart2, MessageCircle, ShoppingBag, CirclePercent, AlertTriangle } from 'lucide-react';
import { ACCESS_TOKEN } from '../constants';
import defaultProfileImage from '../../../backend/media/media/default-avatar-profile-icon-of-social-media-user-vector.jpg';
import '../styles/Verstock.css';

const baseMediaURL = 'http://localhost:8000/media/'; // Cambia esto a la URL correcta de tu servidor

export default function Verstock() {
  const [lowStockCustomers, setLowStockCustomers] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [currentPage, setCurrentPage] = useState('/verstock');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error('No hay token disponible');
      navigate('/login');
      return;
    }

    fetch('http://localhost:8000/api/clientes-bajo-stock/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          console.log('Clientes con bajo stock:', data);
          const groupedData = data.reduce((acc, item) => {
            if (!acc[item.customer]) {
              acc[item.customer] = {
                customer: item.customer,
                customer_id: item.customer_id,
                // Usa la URL de la foto si está disponible, de lo contrario usa la imagen predeterminada
                photo_url: item.photo_url ? `${baseMediaURL}${item.photo_url}` : defaultProfileImage,
                productos: {},
              };
            }
            if (acc[item.customer].productos[item.producto]) {
              acc[item.customer].productos[item.producto].stock_restante += item.stock_restante;
            } else {
              acc[item.customer].productos[item.producto] = {
                producto: item.producto,
                stock_restante: item.stock_restante,
              };
            }
            return acc;
          }, {});
          setLowStockCustomers(Object.values(groupedData));
        } else {
          console.error('La respuesta no es un array:', data);
        }
      })
      .catch((error) => {
        console.error('Error al obtener los clientes con bajo stock:', error);
      });
  }, [navigate]);

  const handleProductSelection = (customer, producto) => {
    setSelectedProducts((prevSelected) => {
      const customerProducts = prevSelected[customer] || {};
      return {
        ...prevSelected,
        [customer]: {
          ...customerProducts,
          [producto]: !customerProducts[producto],
        },
      };
    });
  };

  const handleOffer = (customer) => {
    if (!customer.customer_id) {
      console.error('El ID del cliente es indefinido. No se puede enviar el mensaje.');
      return;
    }

    const selectedForCustomer = selectedProducts[customer.customer];
    if (!selectedForCustomer) return;

    const productosSeleccionados = Object.entries(selectedForCustomer)
      .filter(([, selected]) => selected)
      .map(([producto]) => producto);

    if (productosSeleccionados.length > 0) {
      const mensaje = `Hola ${customer.customer}, estamos ofreciendo una promoción para los siguientes productos: ${productosSeleccionados.join(", ")}. ¡Contáctanos para más detalles!`;
      enviarMensaje(customer.customer_id, mensaje);
    } else {
      alert('Por favor selecciona al menos un producto para hacer la oferta.');
    }
  };

  const enviarMensaje = (destinatario_id, contenido) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error('No hay token disponible');
      return;
    }

    if (!destinatario_id) {
      console.error('El ID del destinatario es indefinido. No se puede enviar el mensaje.');
      return;
    }

    const mensajeData = {
      contenido,
      destinatario: destinatario_id,
    };

    console.log('Enviando mensaje:', mensajeData);

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
        console.log('Mensaje enviado:', data);
        alert(`Mensaje enviado a ${destinatario_id}: ${contenido}`);
      })
      .catch((error) => console.error('Error al enviar el mensaje:', error));
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
    <div className="vs-container">
      <aside className="vs-sidebar">
        <div className="vs-logo-container">
          <h1 className="vs-logo">Stocket</h1>
        </div>
        <nav className="vs-sidebar-nav">
          {sidebarSections.map((section, index) => (
            <div key={index} className="vs-nav-section">
              <h2 className="vs-nav-section-title">{section.title}</h2>
              {section.items.map((item) => (
                <button
                  key={item.name}
                  className={`vs-nav-item ${currentPage === item.path ? 'vs-active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="vs-nav-icon" />
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="vs-main-content">
        <header className="vs-navbar">
          <div className="vs-navbar-container">
            <h1 className="vs-navbar-title">Clientes con Bajo Stock</h1>
            <div className="vs-navbar-actions">
              <button className="vs-navbar-button" onClick={() => navigate("/chat")}>
                <MessageCircle className="vs-navbar-icon" />
              </button>
              <button className="vs-navbar-button" onClick={() => navigate("/carrito")}>
              </button>
            </div>
          </div>
        </header>

        <main className="vs-page-content">
          <div className="vs-content-container">
            {lowStockCustomers.length === 0 ? (
              <p className="vs-stock-empty">No hay clientes con bajo stock.</p>
            ) : (
              <div className="vs-low-stock-customers">
                <ul className="vs-customer-list">
                  {lowStockCustomers.map((customer) => (
                    <li key={customer.customer} className="vs-customer-item">
                      <div className="vs-customer-header">
                        <img
                          src={customer.photo_url || defaultProfileImage}
                          alt={`Foto de ${customer.customer}`}
                          className="vs-customer-photo"
                        />
                        <h3 className="vs-customer-name">{customer.customer}</h3>
                      </div>
                      <div className="vs-customer-details">
                        <ul className="vs-customer-products">
                          {Object.values(customer.productos).map((producto, index) => (
                            <li key={index} className="vs-customer-product">
                              <div className="vs-product-info">
                                <p className="vs-product-name">Producto: {producto.producto}</p>
                                <p className="vs-stock-info">
                                  Stock Restante: {producto.stock_restante}
                                  {producto.stock_restante < 10 && (
                                    <AlertTriangle className="vs-stock-alert-icon" />
                                  )}
                                </p>
                              </div>
                              <label className="vs-product-select">
                                <input
                                  type="checkbox"
                                  checked={selectedProducts[customer.customer]?.[producto.producto] || false}
                                  onChange={() => handleProductSelection(customer.customer, producto.producto)}
                                />
                                <span className="vs-checkmark"></span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="vs-customer-actions">
                        <button
                          className="vs-offer-button"
                          onClick={() => handleOffer(customer)}
                        >
                          Hacer Oferta
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
