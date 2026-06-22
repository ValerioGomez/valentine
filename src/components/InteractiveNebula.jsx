// InteractiveNebula.jsx
import React, { useRef, useEffect, useCallback } from 'react';

const COLORS = [
  { r: 236, g: 72, b: 153 },   // #ec4899 pink
  { r: 139, g: 92, b: 246 },   // #8b5cf6 violet
  { r: 168, g: 85, b: 247 },   // #a855f7 purple
  { r: 244, g: 114, b: 182 },  // #f472b6 light pink
  { r: 99, g: 102, b: 241 },   // #6366f1 indigo
  { r: 217, g: 70, b: 239 },   // #d946ef fuchsia
];

class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 180 + 60;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = Math.random() * 0.12 + 0.03;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.pulseSpeed = Math.random() * 0.008 + 0.003;
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.targetX = this.x;
    this.targetY = this.y;
    this.homeX = this.x;
    this.homeY = this.y;
    this.interactRadius = Math.random() * 120 + 80;
    this.interactStrength = Math.random() * 0.015 + 0.008;
  }

  update(time, mouseX, mouseY, mouseActive) {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Pulse size
    const pulse = Math.sin(time * this.pulseSpeed + this.pulsePhase);
    this.currentSize = this.size + pulse * 20;
    this.currentAlpha = this.alpha + pulse * 0.02;

    // Mouse/touch interaction
    if (mouseActive && mouseX !== null && mouseY !== null) {
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 350;

      if (dist < maxDist) {
        const force = (1 - dist / maxDist) * this.interactStrength;
        // Attract gently towards cursor
        this.vx += dx * force * 0.3;
        this.vy += dy * force * 0.3;
        // Boost alpha near cursor
        this.currentAlpha = Math.min(this.currentAlpha + (1 - dist / maxDist) * 0.08, 0.25);
        // Boost size near cursor
        this.currentSize += (1 - dist / maxDist) * 40;
      }
    }

    // Drift back to home slowly
    this.vx += (this.homeX - this.x) * 0.0003;
    this.vy += (this.homeY - this.y) * 0.0003;

    // Damping
    this.vx *= 0.985;
    this.vy *= 0.985;

    this.x += this.vx;
    this.y += this.vy;

    // Wrap around edges softly
    if (this.x < -this.currentSize) this.x = w + this.currentSize;
    if (this.x > w + this.currentSize) this.x = -this.currentSize;
    if (this.y < -this.currentSize) this.y = h + this.currentSize;
    if (this.y > h + this.currentSize) this.y = -this.currentSize;
  }

  draw(ctx) {
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.currentSize
    );
    gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.currentAlpha * 1.5})`);
    gradient.addColorStop(0.4, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.currentAlpha * 0.8})`);
    gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

// Small twinkling star particles
class Star {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = Math.random() * 1.8 + 0.3;
    this.twinkleSpeed = Math.random() * 0.02 + 0.005;
    this.phase = Math.random() * Math.PI * 2;
    this.maxAlpha = Math.random() * 0.6 + 0.2;
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.color = c;
  }

  update(time, mouseX, mouseY, mouseActive) {
    this.alpha = (Math.sin(time * this.twinkleSpeed + this.phase) * 0.5 + 0.5) * this.maxAlpha;

    if (mouseActive && mouseX !== null && mouseY !== null) {
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        this.alpha = Math.min(this.alpha + (1 - dist / 200) * 0.5, 1);
      }
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
    ctx.fill();
  }
}

export default function InteractiveNebula() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const starsRef = useRef([]);
  const mouseRef = useRef({ x: null, y: null, active: false });
  const animRef = useRef(null);
  const timeRef = useRef(0);

  const getPointerPos = useCallback((e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: (clientX - rect.left) * dpr,
      y: (clientY - rect.top) * dpr,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';

      // Reinit particles on resize
      const isMobile = w < 768;
      const particleCount = isMobile ? 8 : 14;
      const starCount = isMobile ? 30 : 70;

      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(new Particle(canvas));
      }
      starsRef.current = [];
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push(new Star(canvas));
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse events
    const onMouseMove = (e) => {
      const pos = getPointerPos(e, canvas);
      mouseRef.current.x = pos.x;
      mouseRef.current.y = pos.y;
      mouseRef.current.active = true;
    };
    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    // Touch events
    const onTouchMove = (e) => {
      const pos = getPointerPos(e, canvas);
      mouseRef.current.x = pos.x;
      mouseRef.current.y = pos.y;
      mouseRef.current.active = true;
    };
    const onTouchStart = (e) => {
      const pos = getPointerPos(e, canvas);
      mouseRef.current.x = pos.x;
      mouseRef.current.y = pos.y;
      mouseRef.current.active = true;
    };
    const onTouchEnd = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);

    // Animation loop
    const animate = () => {
      timeRef.current++;
      const { x, y, active } = mouseRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw nebula particles with additive blending for glow
      ctx.globalCompositeOperation = 'screen';

      for (const p of particlesRef.current) {
        p.update(timeRef.current, x, y, active);
        p.draw(ctx);
      }

      // Draw stars with normal blending
      ctx.globalCompositeOperation = 'source-over';
      for (const s of starsRef.current) {
        s.update(timeRef.current, x, y, active);
        s.draw(ctx);
      }

      // Draw a subtle cursor glow when interactive
      if (active && x !== null && y !== null) {
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 180);
        glow.addColorStop(0, 'rgba(236, 72, 153, 0.06)');
        glow.addColorStop(0.5, 'rgba(139, 92, 246, 0.03)');
        glow.addColorStop(1, 'rgba(139, 92, 246, 0)');
        ctx.beginPath();
        ctx.arc(x, y, 180, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchend', onTouchEnd);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [getPointerPos]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        zIndex: 0,
      }}
    />
  );
}
