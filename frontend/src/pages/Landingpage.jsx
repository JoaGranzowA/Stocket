import React from 'react';
import { ArrowRight, Zap, DollarSign, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "../styles/Landingpage.css"

export default function LandingPage() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };


  return (
    <div className="landing-container">
      <header className="header-landing">
        <div className="logo-container-landing">
          <h1 className="logo-landing">Stocket</h1>
        </div>
        <nav className="nav-landing">
          <a href="#features" className="nav-link-landing">Características</a>
          <a href="#about" className="nav-link-landing">Acerca de</a>
          <a href="#contact" className="nav-link-landing">Contacto</a>
        </nav>
      </header>

      <main className="main-content-landing">
        <section className="hero">
          <h2 className="hero-title">Conecta y Crece con Stocket</h2>
          <p className="hero-subtitle">
            Elimina intermediarios, negocia directamente y toma el control de tu negocio
          </p>
          <button className="cta-button" onClick={handleRegisterClick}>
            Empieza Ahora <ArrowRight className="button-icon" />
          </button>
        </section>

        <section id="features" className="features">
          <h3 className="section-title">Características Principales</h3>
          <div className="feature-grid">
            <div className="feature-card">
              <Zap className="feature-icon" />
              <h4 className="feature-title">Conexión Directa</h4>
              <p className="feature-description">
                Negocia directamente sin intermediarios ni comisiones ocultas.
              </p>
            </div>
            <div className="feature-card">
              <DollarSign className="feature-icon" />
              <h4 className="feature-title">Control Total</h4>
              <p className="feature-description">
                Gestiona pedidos y facturas con herramientas exclusivas.
              </p>
            </div>
            <div className="feature-card">
              <BarChart2 className="feature-icon" />
              <h4 className="feature-title">Análisis Detallado</h4>
              <p className="feature-description">
                Analiza tus transacciones para tomar decisiones informadas.
              </p>
            </div>
          </div>
        </section>

        <section id="about" className="about">
          <h3 className="section-title">Acerca de Stocket</h3>
          <p className="about-text">
            Stocket es la plataforma que revoluciona la forma en que haces negocios. 
            Ofrecemos una conexión rápida y eficiente para tu empresa, eliminando barreras 
            y proporcionándote las herramientas necesarias para crecer.
          </p>
        </section>

        <section id="showcase" className="showcase">
          <h3 className="section-title">Descubre Stocket en Acción</h3>
          <div className="showcase-container">
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-3B2hR2qJtjyoxvd0A0uB8NipCO2gn5.png" alt="Interfaz de Stocket" className="showcase-image" />
          </div>
          <p className="showcase-description">
            Experimenta una interfaz intuitiva y potente que te permite gestionar tus productos, 
            pedidos y análisis de manera eficiente.
          </p>
        </section>

        <section id="contact" className="contact">
          <h3 className="section-title">Contáctanos</h3>
          <form className="contact-form">
            <input type="email" placeholder="Tu correo electrónico" className="form-input" />
            <button type="submit" className="submit-button">Suscribirse</button>
          </form>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 Stocket. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}