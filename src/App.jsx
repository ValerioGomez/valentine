// App.jsx
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';
import { 
  Heart, Download, Globe, Code, Copy, Check, Play, ChevronRight, 
  Music, Layers, Mic, Sliders, FolderOpen, Home, Sparkles, 
  Terminal, Star, Zap, Shield, ExternalLink
} from 'lucide-react';
import InteractivePlayer from './components/InteractivePlayer';
import InteractiveNebula from './components/InteractiveNebula';

// Reusable scroll-animated wrapper (animates on BOTH scroll up and down)
function AnimatedSection({ children, className, style, id, delay = 0 }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { margin: "-80px", once: false }); // once: false = animates both ways!

  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.7, 
        ease: [0.16, 1, 0.3, 1],
        delay 
      }}
    >
      {children}
    </motion.div>
  );
}

// Reusable stagger container that re-triggers
function StaggerGrid({ children, className }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { margin: "-60px", once: false });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.12 }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

function App() {
  const [copied, setCopied] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  const copyBrewCommand = () => {
    navigator.clipboard.writeText('brew install --cask valentine');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToSection = (id) => {
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const sections = ['home', 'features', 'stats', 'demo', 'download'];
    const handleScroll = () => {
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight / 2) {
            setActiveNav(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Fixed Side Navigation */}
      <nav className="side-nav">
        <div className="side-nav-logo" onClick={() => scrollToSection('home')}>
          <Heart size={20} fill="white" color="white" />
        </div>

        <button className={`side-nav-item ${activeNav === 'home' ? 'active' : ''}`} onClick={() => scrollToSection('home')}>
          <Home size={20} />
          <span className="side-nav-tooltip">Inicio</span>
        </button>

        <button className={`side-nav-item ${activeNav === 'features' ? 'active' : ''}`} onClick={() => scrollToSection('features')}>
          <Sparkles size={20} />
          <span className="side-nav-tooltip">Características</span>
        </button>

        <button className={`side-nav-item ${activeNav === 'stats' ? 'active' : ''}`} onClick={() => scrollToSection('stats')}>
          <Zap size={20} />
          <span className="side-nav-tooltip">Rendimiento</span>
        </button>

        <button className={`side-nav-item ${activeNav === 'demo' ? 'active' : ''}`} onClick={() => scrollToSection('demo')}>
          <Play size={20} />
          <span className="side-nav-tooltip">Demo en Vivo</span>
        </button>

        <div className="side-nav-divider" />

        <button className={`side-nav-item ${activeNav === 'download' ? 'active' : ''}`} onClick={() => scrollToSection('download')}>
          <Download size={20} />
          <span className="side-nav-tooltip">Descargar</span>
        </button>

        <div className="side-nav-spacer" />

        <button className="side-nav-item" onClick={() => window.open('https://github.com/JesusChapman/valentine', '_blank')}>
          <ExternalLink size={20} />
          <span className="side-nav-tooltip">GitHub</span>
        </button>
      </nav>

      <div className="landing-wrapper">
        {/* Top Navbar */}
        <header className="landing-navbar">
          <div className="navbar-content">
            <a href="#" className="navbar-brand" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
              <Heart size={20} fill="#ec4899" color="#ec4899" />
              Valentine
            </a>
            <nav className="navbar-links">
              <span className="navbar-link" onClick={() => scrollToSection('features')}>Características</span>
              <span className="navbar-link" onClick={() => scrollToSection('stats')}>Rendimiento</span>
              <span className="navbar-link" onClick={() => scrollToSection('demo')}>Demo</span>
              <span className="navbar-link" onClick={() => scrollToSection('download')}>Descargar</span>
              <a href="#demo" className="navbar-cta" onClick={(e) => { e.preventDefault(); scrollToSection('demo'); }}>
                Probar Demo
              </a>
            </nav>
          </div>
        </header>

        {/* ===== HERO SECTION (Dark) ===== */}
        <section id="home" className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Interactive Nebula Background */}
          <div className="nebula-container">
            <InteractiveNebula />
          </div>
          <AnimatedSection>
            <span className="hero-tagline">Reproductor Nativo para macOS Tahoe 26+</span>
          </AnimatedSection>
          
          <AnimatedSection delay={0.1}>
            <h1 className="hero-title">
              Esculpido en<br />Cristal Líquido.
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <p className="hero-description">
              Valentine redefine la experiencia musical en macOS. Una interfaz orgánica que respira y se transforma al ritmo de tus canciones favoritas.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="hero-actions">
              <button className="btn-apple btn-apple-primary" onClick={() => scrollToSection('demo')}>
                Probar Demo Online
                <Play size={16} style={{ display: 'inline-block', marginLeft: '10px', verticalAlign: 'middle' }} />
              </button>
              <button className="btn-apple btn-apple-secondary" onClick={() => scrollToSection('download')}>
                Instalar en macOS
                <ChevronRight size={16} style={{ display: 'inline-block', marginLeft: '6px', verticalAlign: 'middle' }} />
              </button>
            </div>
          </AnimatedSection>

          {/* Floating Perspective Mockup */}
          <AnimatedSection delay={0.3}>
            <div className="hero-mockup-wrapper">
              <div className="hero-mockup-glow" />
              <div className="hero-mockup">
                <InteractivePlayer />
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* ===== FEATURES BENTO GRID (White Section) ===== */}
        <section id="features" className="bento-section section-light">
          <div className="bento-inner">
            <AnimatedSection>
              <div className="section-header">
                <p className="section-tagline">Detalles que marcan la diferencia</p>
                <h2 className="section-title">Diseñado con obsesión.</h2>
                <p className="section-subtitle">Cada pixel ha sido cuidadosamente seleccionado para ofrecer una experiencia musical que se siente nativa, fluida y absolutamente premium.</p>
              </div>
            </AnimatedSection>

            <StaggerGrid className="bento-grid">
              {/* Card 1: Liquid Glass */}
              <motion.div className="bento-card" variants={cardVariant}>
                <div className="bento-icon-box">
                  <Layers size={22} />
                </div>
                <h3 className="bento-title">Cristal Líquido</h3>
                <p className="bento-desc">
                  Una interfaz translúcida basada en glassmorphism profundo que extrae tonalidades dinámicas de la carátula activa para un fondo vibrante y envolvente.
                </p>
                <div className="bento-graphic-glass" />
              </motion.div>

              {/* Card 2: Synced Lyrics */}
              <motion.div className="bento-card bento-large" variants={cardVariant}>
                <div className="bento-icon-box">
                  <Mic size={22} />
                </div>
                <h3 className="bento-title">Letras en Sincronía Perfecta</h3>
                <p className="bento-desc">
                  Visualiza las letras de tus canciones con tipografía bold y efectos de desenfoque dinámico. Haz clic en cualquier verso para saltar directamente a ese momento del audio.
                </p>
                <div className="bento-graphic-lyrics">
                  <div className="bento-lyric-item">We're waiting every night to finally roam and invite...</div>
                  <div className="bento-lyric-item highlight">You should have looked for another job</div>
                  <div className="bento-lyric-item">You should have said to this place goodbye...</div>
                </div>
              </motion.div>

              {/* Card 3: Drag & Drop */}
              <motion.div className="bento-card bento-tall" variants={cardVariant}>
                <div>
                  <div className="bento-icon-box">
                    <FolderOpen size={22} />
                  </div>
                  <h3 className="bento-title">Tu música, al instante</h3>
                  <p className="bento-desc">
                    Sin configuraciones complejas. Simplemente arrastra tus archivos .flac, .mp3 o carpetas enteras directo a la ventana del reproductor.
                  </p>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.02)', border: '2px dashed rgba(0,0,0,0.1)', borderRadius: '16px', padding: '32px', textAlign: 'center', marginTop: '30px' }}>
                  <Download size={28} style={{ display: 'inline-block', color: '#ec4899', marginBottom: '8px' }} />
                  <div style={{ fontSize: '14px', color: '#86868b', fontWeight: 500 }}>Arrastra archivos de audio aquí</div>
                </div>
              </motion.div>

              {/* Card 4: Waveform visualizer */}
              <motion.div className="bento-card bento-large" variants={cardVariant}>
                <div className="bento-icon-box">
                  <Sliders size={22} />
                </div>
                <h3 className="bento-title">Espectro de Onda Procedural</h3>
                <p className="bento-desc">
                  Un visualizador de ondas dinámico dibujado en lienzo HTML5 de alta fidelidad. Vibra orgánicamente al reproducir música y muestra el progreso en tiempo real.
                </p>
                <div style={{ marginTop: '24px', display: 'flex', gap: '4px', height: '48px', alignItems: 'center', justifyContent: 'center' }}>
                  {[0.4, 0.7, 0.9, 0.5, 0.3, 0.8, 0.95, 0.6, 0.4, 0.7, 0.8, 0.5, 0.3, 0.8, 0.95, 0.6, 0.45, 0.75].map((h, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        flex: 1, 
                        height: `${h * 100}%`, 
                        background: i < 10 ? '#ec4899' : 'rgba(0,0,0,0.08)', 
                        borderRadius: '3px',
                        transition: 'height 0.3s ease'
                      }} 
                    />
                  ))}
                </div>
              </motion.div>
            </StaggerGrid>
          </div>
        </section>

        {/* ===== STATS BANNER (White) ===== */}
        <section id="stats" className="stats-banner">
          <div className="stats-inner">
            <AnimatedSection delay={0}>
              <div className="stat-card">
                <div className="stat-number">100%</div>
                <div className="stat-label">Nativo para macOS</div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="stat-card">
                <div className="stat-number">0ms</div>
                <div className="stat-label">Latencia de audio</div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="stat-card">
                <div className="stat-number">FLAC</div>
                <div className="stat-label">Soporte Hi-Fi completo</div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.3}>
              <div className="stat-card">
                <div className="stat-number">GPL-3</div>
                <div className="stat-label">Código abierto</div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ===== LIVE DEMO SECTION (Dark) ===== */}
        <section id="demo" className="demo-section">
          <AnimatedSection>
            <div className="section-header" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
              <p className="section-tagline">Prueba de Producto</p>
              <h2 className="section-title" style={{ color: '#ffffff' }}>Pruébalo en vivo<br />ahora mismo.</h2>
              <p className="section-subtitle" style={{ margin: '16px auto 0 auto', color: '#86868b' }}>
                Esta es la simulación completa del reproductor web. Haz clic en "Probar con demos" o arrastra tus archivos de música locales para ver sus capacidades.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="demo-player-container">
              <InteractivePlayer />
            </div>
          </AnimatedSection>
        </section>

        {/* ===== DOWNLOAD CTA (Gradient Section) ===== */}
        <section id="download" className="download-section">
          <AnimatedSection>
            <p className="section-tagline">Instalación nativa</p>
            <h2 className="section-title" style={{ fontSize: '56px', marginBottom: '20px' }}>Llévalo a tu Mac.</h2>
            <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.65)', maxWidth: '560px', margin: '0 auto 40px auto', lineHeight: '1.5' }}>
              Valentine está listo para ser instalado en macOS Tahoe 26+. Disfruta del máximo rendimiento nativo con una sola línea.
            </p>
          </AnimatedSection>

          {/* Brew command box */}
          <AnimatedSection delay={0.15}>
            <div className="terminal-box">
              <span className="terminal-prompt">$</span>
              <span className="terminal-command">brew install --cask valentine</span>
              <button className="terminal-copy" onClick={copyBrewCommand} title="Copiar comando">
                {copied ? <Check size={18} color="#27c93f" /> : <Copy size={18} />}
              </button>
              {copied && <span className="copy-tooltip">¡Copiado!</span>}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-apple btn-apple-primary" onClick={() => alert("Descargando Valentine.dmg para macOS...")}>
                <Download size={16} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
                Descargar .dmg
              </button>
              <button className="btn-apple btn-apple-secondary" style={{ borderColor: '#c4b5fd', color: '#c4b5fd' }} onClick={() => window.open('https://github.com/JesusChapman/valentine', '_blank')}>
                <ExternalLink size={16} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
                Ver en GitHub
              </button>
            </div>
          </AnimatedSection>
        </section>

        {/* Apple-style Footer */}
        <footer className="apple-footer">
          <div className="footer-content">
            <div className="footer-grid">
              <div>
                <h4 className="footer-col-title">Producto</h4>
                <ul className="footer-links">
                  <li><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Características</a></li>
                  <li><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); scrollToSection('demo'); }}>Demo Online</a></li>
                  <li><a href="#" className="footer-link">Homebrew Cask</a></li>
                  <li><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); scrollToSection('download'); }}>Descargas</a></li>
                </ul>
              </div>
              <div>
                <h4 className="footer-col-title">Desarrolladores</h4>
                <ul className="footer-links">
                  <li><a href="https://github.com/JesusChapman/valentine" target="_blank" rel="noreferrer" className="footer-link">GitHub Repository</a></li>
                  <li><a href="#" className="footer-link">GPL-3.0 License</a></li>
                  <li><a href="#" className="footer-link">API de Waveform</a></li>
                  <li><a href="#" className="footer-link">Contribuir</a></li>
                </ul>
              </div>
              <div>
                <h4 className="footer-col-title">Comunidad</h4>
                <ul className="footer-links">
                  <li><a href="#" className="footer-link">Reddit</a></li>
                  <li><a href="#" className="footer-link">Discord Server</a></li>
                  <li><a href="#" className="footer-link">Soporte</a></li>
                </ul>
              </div>
              <div>
                <h4 className="footer-col-title">Compañía</h4>
                <ul className="footer-links">
                  <li><a href="#" className="footer-link">Sobre Nosotros</a></li>
                  <li><a href="#" className="footer-link">Blog</a></li>
                  <li><a href="#" className="footer-link">Prensa</a></li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              <div>Copyright © 2026 Valentine Project. Todos los derechos reservados.</div>
              <div className="footer-legal">
                <a href="#" className="footer-link">Privacidad</a>
                <a href="#" className="footer-link">Términos</a>
                <a href="#" className="footer-link">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
