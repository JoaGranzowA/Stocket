import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Package, Lightbulb, ShoppingCart, BarChart2, Settings, LogOut, CirclePercent, Box, FileText, AlertTriangle } from 'lucide-react';
import { ACCESS_TOKEN } from '../constants';
import '../styles/Verstock.css';

export default function Verstock() {
  const [currentPage, setCurrentPage] = useState('/verstock');
  const [lowStockCustomers, setLowStockCustomers] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({}); // Estado para productos seleccionados
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error('No hay token disponible');
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
                customer_id: item.customer_id, // Guardar ID del cliente para enviar el mensaje
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
  }, []);

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

      // Enviar mensaje al backend
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
      destinatario: destinatario_id, // Utilizando el ID del destinatario
    };

    console.log('Enviando mensaje:', mensajeData); // Debug

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

  const navItems = [
    { name: 'Inicio', icon: Home, path: '/proveedor/home' },
    { name: 'Mis Productos', icon: Box, path: '/misproductos' },
    { name: 'Gestión de Pedidos', icon: ShoppingCart, path: '/gestionpedidos' },
    { name: 'Facturación y Finanzas', icon: FileText, path: '/finanzas' },
    { name: 'Ofertar', icon: CirclePercent, path: '/verstock' },
    { name: 'Configuración', icon: Settings, path: '/perfil' },
    { name: 'Cerrar sesión', icon: LogOut, path: '/logout' },
  ];

  return (
    <div className="verstock-container">
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
              {React.createElement(item.icon, { className: "nav-icon" })}
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      <div className="main-content">
        <header className="navbar">
          <div className="navbar-container">
            <h1 className="navbar-title">Clientes con Bajo Stock</h1>
          </div>
        </header>

        <main className="page-content">
          <div className="content-container">
            {lowStockCustomers.length === 0 ? (
              <p className="stock-empty">No hay clientes con bajo stock.</p>
            ) : (
              <div className="low-stock-customers">
                <ul className="customer-list">
                  {lowStockCustomers.map((customer) => (
                    <li key={customer.customer} className="customer-item">
                      <div className="customer-details">
                        <h3 className="customer-name">Cliente: {customer.customer}</h3>
                        <ul className="customer-products">
                          {Object.values(customer.productos).map((producto, index) => (
                            <li key={index} className="customer-product">
                              <div className="product-info">
                                <p className="product-name">Producto: {producto.producto}</p>
                                <p className="stock-info">
                                  Stock Restante: {producto.stock_restante}
                                  {producto.stock_restante < 10 && (
                                    <AlertTriangle className="stock-alert-icon" />
                                  )}
                                </p>
                              </div>
                              <label className="product-select">
                                <input
                                  type="checkbox"
                                  checked={selectedProducts[customer.customer]?.[producto.producto] || false}
                                  onChange={() => handleProductSelection(customer.customer, producto.producto)}
                                />
                                <span className="checkmark"></span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="customer-actions">
                        <button
                          className="offer-button"
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
