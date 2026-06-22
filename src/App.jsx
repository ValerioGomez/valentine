// App.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'framer-motion';
import {
  Heart, Download, Copy, Check, Play, ChevronRight,
  Layers, Mic, Sliders, FolderOpen, Home, Sparkles,
  Zap, ExternalLink
} from 'lucide-react';
import InteractivePlayer from './components/InteractivePlayer';
import InteractiveNebula from './components/InteractiveNebula';
import logo from './assets/logo.png';

// Easing curve reused across the page for a consistent, elegant feel
const EASE = [0.16, 1, 0.3, 1];

// Offset per direction so elements appear from the correct side.
// Animations re-trigger on BOTH scroll up and down (once: false).
const DIRECTION_OFFSET = {
  up:    { x: 0,   y: 60  },
  down:  { x: 0,   y: -60 },
  left:  { x: 90,  y: 0   },
  right: { x: -90, y: 0   },
};

// Reusable scroll-animated wrapper.
// `from` controls where the element enters from (up/down/left/right).
function AnimatedSection({ children, className, style, id, delay = 0, from = 'up' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-12% 0px -12% 0px', once: false });
  const offset = DIRECTION_OFFSET[from] || DIRECTION_OFFSET.up;

  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      style={style}
      initial={{ opacity: 0, x: offset.x, y: offset.y, filter: 'blur(8px)' }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }
          : { opacity: 0, x: offset.x, y: offset.y, filter: 'blur(8px)' }
      }
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

// Stagger container where each child can declare its own entry direction.
// `<motion.div variants={makeCardVariant('left')} />` etc.
function StaggerGrid({ children, className, from = 'up' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-10% 0px -10% 0px', once: false });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.12, delayChildren: 0.05 },
        },
      }}
      data-stagger-from={from}
    >
      {children}
    </motion.div>
  );
}

// Build a card variant for a given direction (used inside a StaggerGrid).
function makeCardVariant(from) {
  const o = DIRECTION_OFFSET[from] || DIRECTION_OFFSET.up;
  return {
    hidden: { opacity: 0, x: o.x * 0.6, y: o.y * 0.6, scale: 0.96, filter: 'blur(6px)' },
    visible: {
      opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)',
      transition: { duration: 0.7, ease: EASE },
    },
  };
}

// Direction-aware motion card; default direction cycles for visual rhythm.
function MotionCard({ children, className, from = 'up', ...rest }) {
  return (
    <motion.div className={className} variants={makeCardVariant(from)} {...rest}>
      {children}
    </motion.div>
  );
}

function App() {
  const [copied, setCopied] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  // Subtle parallax on the hero mockup tied to page scroll.
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const mockupY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 120]), {
    stiffness: 80,
    damping: 20,
    mass: 0.4,
  });
  const mockupScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const mockupOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);

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
      for (const id of [...sections].reverse()) {
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
          <img src={logo} alt="Valentine" className="side-nav-logo-img" />
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
              <img src={logo} alt="Valentine" className="brand-logo" />
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
        <section ref={heroRef} id="home" className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Interactive Nebula Background */}
          <div className="nebula-container">
            <InteractiveNebula />
          </div>
          <AnimatedSection from="up">
            <img src={logo} alt="Valentine — reproductor de música para macOS" className="hero-logo" />
          </AnimatedSection>

          <AnimatedSection from="up">
            <span className="hero-tagline">Reproductor Nativo para macOS Tahoe 26+</span>
          </AnimatedSection>
          
          <AnimatedSection from="up" delay={0.1}>
            <h1 className="hero-title">
              Esculpido en<br />Cristal Líquido.
            </h1>
          </AnimatedSection>

          <AnimatedSection from="up" delay={0.15}>
            <p className="hero-description">
              Valentine redefine la experiencia musical en macOS. Una interfaz orgánica que respira y se transforma al ritmo de tus canciones favoritas.
            </p>
          </AnimatedSection>

          <AnimatedSection from="up" delay={0.2}>
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

          {/* Floating Perspective Mockup with scroll-driven parallax */}
          <AnimatedSection from="up" delay={0.3}>
            <motion.div
              className="hero-mockup-wrapper"
              style={{ y: mockupY, scale: mockupScale, opacity: mockupOpacity }}
            >
              <div className="hero-mockup-glow" />
              <div className="hero-mockup">
                <InteractivePlayer />
              </div>
            </motion.div>
          </AnimatedSection>
        </section>

        {/* ===== FEATURES BENTO GRID (White Section) ===== */}
        <section id="features" className="bento-section section-light">
          <div className="bento-inner">
            <AnimatedSection from="up">
              <div className="section-header">
                <p className="section-tagline">Detalles que marcan la diferencia</p>
                <h2 className="section-title">Diseñado con obsesión.</h2>
                <p className="section-subtitle">Cada pixel ha sido cuidadosamente seleccionado para ofrecer una experiencia musical que se siente nativa, fluida y absolutamente premium.</p>
              </div>
            </AnimatedSection>

            <StaggerGrid className="bento-grid" from="up">
              {/* Card 1: Liquid Glass */}
              <MotionCard className="bento-card" from="left">
                <div className="bento-icon-box">
                  <Layers size={22} />
                </div>
                <h3 className="bento-title">Cristal Líquido</h3>
                <p className="bento-desc">
                  Una interfaz translúcida basada en glassmorphism profundo que extrae tonalidades dinámicas de la carátula activa para un fondo vibrante y envolvente.
                </p>
                <div className="bento-graphic-glass" />
              </MotionCard>

              {/* Card 2: Synced Lyrics */}
              <MotionCard className="bento-card bento-large" from="right">
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
              </MotionCard>

              {/* Card 3: Drag & Drop */}
              <MotionCard className="bento-card bento-tall" from="left">
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
              </MotionCard>

              {/* Card 4: Waveform visualizer */}
              <MotionCard className="bento-card bento-large" from="right">
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
              </MotionCard>
            </StaggerGrid>
          </div>
        </section>

        {/* ===== STATS BANNER (White) ===== */}
        <section id="stats" className="stats-banner">
          <div className="stats-inner">
            <AnimatedSection from="left" delay={0}>
              <div className="stat-card">
                <div className="stat-number">100%</div>
                <div className="stat-label">Nativo para macOS</div>
              </div>
            </AnimatedSection>
            <AnimatedSection from="up" delay={0.1}>
              <div className="stat-card">
                <div className="stat-number">0ms</div>
                <div className="stat-label">Latencia de audio</div>
              </div>
            </AnimatedSection>
            <AnimatedSection from="up" delay={0.2}>
              <div className="stat-card">
                <div className="stat-number">FLAC</div>
                <div className="stat-label">Soporte Hi-Fi completo</div>
              </div>
            </AnimatedSection>
            <AnimatedSection from="right" delay={0.3}>
              <div className="stat-card">
                <div className="stat-number">GPL-3</div>
                <div className="stat-label">Código abierto</div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ===== LIVE DEMO SECTION (Dark) ===== */}
        <section id="demo" className="demo-section">
          <AnimatedSection from="up">
            <div className="section-header" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
              <p className="section-tagline">Prueba de Producto</p>
              <h2 className="section-title" style={{ color: '#ffffff' }}>Pruébalo en vivo<br />ahora mismo.</h2>
              <p className="section-subtitle" style={{ margin: '16px auto 0 auto', color: '#86868b' }}>
                Esta es la simulación completa del reproductor web. Haz clic en "Probar con demos" o arrastra tus archivos de música locales para ver sus capacidades.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection from="up" delay={0.2}>
            <div className="demo-player-container">
              <InteractivePlayer />
            </div>
          </AnimatedSection>
        </section>

        {/* ===== DOWNLOAD CTA (Gradient Section) ===== */}
        <section id="download" className="download-section">
          <AnimatedSection from="up">
            <p className="section-tagline">Instalación nativa</p>
            <h2 className="section-title" style={{ fontSize: '56px', marginBottom: '20px' }}>Llévalo a tu Mac.</h2>
            <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.65)', maxWidth: '560px', margin: '0 auto 40px auto', lineHeight: '1.5' }}>
              Valentine está listo para ser instalado en macOS Tahoe 26+. Disfruta del máximo rendimiento nativo con una sola línea.
            </p>
          </AnimatedSection>

          {/* Brew command box */}
          <AnimatedSection from="left" delay={0.15}>
            <div className="terminal-box">
              <span className="terminal-prompt">$</span>
              <span className="terminal-command">brew install --cask valentine</span>
              <button className="terminal-copy" onClick={copyBrewCommand} title="Copiar comando">
                {copied ? <Check size={18} color="#27c93f" /> : <Copy size={18} />}
              </button>
              {copied && <span className="copy-tooltip">¡Copiado!</span>}
            </div>
          </AnimatedSection>

          <AnimatedSection from="right" delay={0.25}>
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
            <AnimatedSection from="left">
              <div className="footer-brand">
                <img src={logo} alt="Valentine" className="brand-logo" style={{ width: 36, height: 36 }} />
                <span className="footer-brand-name">Valentine</span>
              </div>
            </AnimatedSection>
            <StaggerGrid className="footer-grid">
              <MotionCard className="footer-col">
                <h4 className="footer-col-title">Producto</h4>
                <ul className="footer-links">
                  <li><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Características</a></li>
                  <li><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); scrollToSection('demo'); }}>Demo Online</a></li>
                  <li><a href="#" className="footer-link">Homebrew Cask</a></li>
                  <li><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); scrollToSection('download'); }}>Descargas</a></li>
                </ul>
              </MotionCard>
              <MotionCard className="footer-col">
                <h4 className="footer-col-title">Desarrolladores</h4>
                <ul className="footer-links">
                  <li><a href="https://github.com/JesusChapman/valentine" target="_blank" rel="noreferrer" className="footer-link">GitHub Repository</a></li>
                  <li><a href="#" className="footer-link">GPL-3.0 License</a></li>
                  <li><a href="#" className="footer-link">API de Waveform</a></li>
                  <li><a href="#" className="footer-link">Contribuir</a></li>
                </ul>
              </MotionCard>
              <MotionCard className="footer-col">
                <h4 className="footer-col-title">Comunidad</h4>
                <ul className="footer-links">
                  <li><a href="#" className="footer-link">Reddit</a></li>
                  <li><a href="#" className="footer-link">Discord Server</a></li>
                  <li><a href="#" className="footer-link">Soporte</a></li>
                </ul>
              </MotionCard>
              <MotionCard className="footer-col">
                <h4 className="footer-col-title">Compañía</h4>
                <ul className="footer-links">
                  <li><a href="#" className="footer-link">Sobre Nosotros</a></li>
                  <li><a href="#" className="footer-link">Blog</a></li>
                  <li><a href="#" className="footer-link">Prensa</a></li>
                </ul>
              </MotionCard>
            </StaggerGrid>

            <AnimatedSection from="up" className="footer-bottom-wrapper">
              <div className="footer-bottom">
                <div>Copyright © 2026 Valentine Project. Todos los derechos reservados.</div>
                <div className="footer-legal">
                  <a href="#" className="footer-link">Privacidad</a>
                  <a href="#" className="footer-link">Términos</a>
                  <a href="#" className="footer-link">Cookies</a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
