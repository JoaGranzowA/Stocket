import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

export default function LoginForm({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Añadido
  const [successMessage, setSuccessMessage] = useState(""); // Añadido
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Limpiar mensajes anteriores
    setSuccessMessage("");

    try {
      const res = await api.post(route, { username, password })
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      setSuccessMessage("Inicio de sesión exitoso");
      navigate("/home")
    } catch (error) {
      setErrorMessage(error.message || "Error al iniciar sesión");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.leftPanel}>
          <h2 style={styles.title}>Iniciar sesión</h2>
          <p style={styles.description}>
            Ingresa tus credenciales para acceder a tu cuenta
          </p>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="username" style={styles.label}>Nombre de usuario</label>
              <input
                id="username"
                type="text"
                placeholder="Tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.submitButton}>
              Iniciar sesión
            </button>
          </form>
          {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
          {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
        </div>
        <div style={styles.rightPanel}>
          <h2 style={styles.title}>¿Nuevo por aquí?</h2>
          <p style={styles.description}>
            Regístrate para crear una cuenta y acceder a todas las funciones
          </p>
          <button style={styles.registerButton} onClick={handleRegisterClick}>
                Crear cuenta
            </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f0f0",
    padding: "2rem",
    boxSizing: "border-box",
    fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  },
  card: {
    display: "flex",
    width: "100%",
    maxWidth: "800px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    overflow: "hidden",
  },
  leftPanel: {
    flex: 1,
    backgroundColor: "white",
    padding: "2.5rem",
    display: "flex",
    flexDirection: "column",
  },
  rightPanel: {
    flex: 1,
    backgroundColor: "#8B5CF6",
    color: "white",
    padding: "2.5rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
    letterSpacing: "-0.025em",
  },
  description: {
    marginBottom: "1.5rem",
    fontSize: "1rem",
    lineHeight: "1.5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#4B5563",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #D1D5DB",
    fontSize: "1rem",
    transition: "border-color 0.3s",
  },
  submitButton: {
    backgroundColor: "#8B5CF6",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "background-color 0.3s",
  },
  registerButton: {
    backgroundColor: "transparent",
    border: "2px solid white",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "background-color 0.3s, color 0.3s",
  },
  errorMessage: {
    color: "#EF4444",
    marginTop: "1rem",
    fontSize: "0.875rem",
  },
  successMessage: {
    color: "#10B981",
    marginTop: "1rem",
    fontSize: "0.875rem",
  },
};