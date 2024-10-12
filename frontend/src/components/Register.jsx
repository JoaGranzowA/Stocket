import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [isCustomer, setIsCustomer] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/login'); // Asegúrate de que esta sea la ruta correcta
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password1 !== password2) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    const userData = {
      username,
      email,
      password1,
      password2,
      is_admin: isAdmin,
      is_employee: isEmployee,
      is_customer: isCustomer,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(
          errorData.detail || "Ocurrió un error durante el registro."
        );
        setSuccessMessage("");
      } else {
        setSuccessMessage("¡Registro exitoso! Ahora puedes iniciar sesión.");
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setErrorMessage("Error al comunicarse con el servidor.");
      setSuccessMessage("");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.leftPanel}>
          <h2 style={styles.title}>¡Bienvenido de vuelta!</h2>
          <p style={styles.description}>
            Si ya tienes una cuenta, inicia sesión para acceder a todas las
            funciones
          </p>
          <button style={styles.button} onClick={handleRegisterClick}>Iniciar sesión</button>
        </div>
        <div style={styles.rightPanel}>
          <h2 style={styles.title}>Crear cuenta</h2>
          <p style={styles.description}>Ingresa tus datos para registrarte</p>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="username" style={styles.label}>
                Nombre completo
              </label>
              <input
                id="username"
                type="text"
                placeholder="Tu nombre"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password1" style={styles.label}>
                Contraseña
              </label>
              <input
                id="password1"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password2" style={styles.label}>
                Confirmar contraseña
              </label>
              <input
                id="password2"
                type="password"
                placeholder="Repite tu contraseña"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.checkboxGroup}>
              <label style={styles.label}>Selecciona tu rol</label>
              <div style={styles.checkbox}>
                <input
                  type="radio"
                  name="role" // Cambié el nombre del grupo a "role"
                  value="Customer"
                  id="isCustomer"
                  checked={isCustomer}
                  onChange={() => {
                    setIsCustomer(true);
                    setIsEmployee(false);
                  }} // Al seleccionar, establece isCustomer a true y isEmployee a false
                  style={styles.checkboxInput}
                />
                <label htmlFor="isCustomer" style={styles.checkboxLabel}>
                  Vendedor
                </label>
              </div>
              <div style={styles.checkbox}>
                <input
                  type="radio"
                  name="role" // Cambié el nombre del grupo a "role"
                  value="Employee"
                  id="isEmployee"
                  checked={isEmployee}
                  onChange={() => {
                    setIsEmployee(true);
                    setIsCustomer(false);
                  }} // Al seleccionar, establece isEmployee a true y isCustomer a false
                  style={styles.checkboxInput}
                />
                <label htmlFor="isEmployee" style={styles.checkboxLabel}>
                  Proveedor
                </label>
              </div>
            </div>
            <button type="submit" style={styles.submitButton}>
              Registrarse
            </button>
          </form>
          {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
          {successMessage && (
            <p style={styles.successMessage}>{successMessage}</p>
          )}
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
    fontFamily:
      "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
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
    backgroundColor: "#8B5CF6",
    color: "white",
    padding: "2.5rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  rightPanel: {
    flex: 1,
    backgroundColor: "white",
    padding: "2.5rem",
    display: "flex",
    flexDirection: "column",
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
  button: {
    backgroundColor: "transparent",
    border: "2px solid white",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "1.5rem",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "background-color 0.3s, color 0.3s",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    flex: 1,
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
  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  checkbox: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  checkboxInput: {
    width: "1.25rem",
    height: "1.25rem",
    cursor: "pointer",
  },
  checkboxLabel: {
    fontSize: "1rem",
    color: "#4B5563",
    cursor: "pointer",
  },
  submitButton: {
    backgroundColor: "#8B5CF6",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    marginTop: "1.5rem",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "background-color 0.3s",
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
