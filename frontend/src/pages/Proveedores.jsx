import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Package, Lightbulb, ShoppingCart, Box, FileText, Settings, LogOut, BarChart2, Search } from 'lucide-react';
import { ACCESS_TOKEN } from '../constants';
import '../styles/Proveedores.css';

export default function EmployeesList() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState('/proveedores');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
      console.error('No hay token disponible');
      navigate('/login');
      return;
    }

    // Fetch para obtener la lista de empleados
    fetch('http://localhost:8000/api/employees/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        return response.json();
      })
      .then((data) => {
        setEmployees(data);
        setFilteredEmployees(data);
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
      });
  }, [navigate]);

  useEffect(() => {
    const results = employees.filter(employee =>
      employee.user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(results);
  }, [searchTerm, employees]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

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
              Proveedores Disponibles
            </a>
          </div>
        </header>

        <main className="page-content">
          <div className="content-container">
            <div className="employees-list-container">
              <h1>Proveedores Disponibles</h1>
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscar proveedor..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
              </div>
              <ul className="employees-grid">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee, index) => (
                    <li key={index} className="employee-card">
                      <div className="employee-info">
                        {employee.profile.foto ? (
                          <img
                            src={`http://localhost:8000${employee.profile.foto}`}
                            alt={`Foto de ${employee.user.username}`}
                            className="employee-photo"
                          />
                        ) : (
                          <div className="employee-photo-placeholder">
                            Sin Foto
                          </div>
                        )}
                        <h2>{employee.user.username}</h2>
                        <p>Email: {employee.user.email}</p>
                        <p>Ubicación: {employee.profile.ubicacion || 'No especificada'}</p>
                        <button onClick={() => navigate(`/perfil/${employee.user.id}`)}>Ver Perfil</button>
                      </div>
                    </li>
                  ))
                ) : (
                  <p>No hay proveedores disponibles.</p>
                )}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}






