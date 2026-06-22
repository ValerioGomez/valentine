// Waveform.jsx
import React, { useRef, useEffect } from 'react';

const Waveform = ({ isPlaying, currentTime, duration, theme }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const phaseRef = useRef(0);

  // Generate static base heights for 80 bars (bell-curve style)
  const totalBars = 90;
  const baseHeights = useRef([]);
  
  if (baseHeights.current.length === 0) {
    for (let i = 0; i < totalBars; i++) {
      // Create a nice distribution: higher in the middle, lower at the edges
      const x = (i - totalBars / 2) / (totalBars / 2);
      const bell = Math.exp(-x * x * 3); // Bell curve
      const noise = 0.15 + Math.random() * 0.15;
      baseHeights.current.push(bell * 0.7 + noise);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    let height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;

    const draw = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, width, height);

      const barWidth = (width / totalBars) * 0.65;
      const barGap = (width / totalBars) * 0.35;
      const progressFraction = duration > 0 ? currentTime / duration : 0;
      const activeBarCount = Math.floor(progressFraction * totalBars);

      // Advance phase if playing to animate the waveform
      if (isPlaying) {
        phaseRef.current += 0.08;
      }

      for (let i = 0; i < totalBars; i++) {
        let hPercent = baseHeights.current[i];

        if (isPlaying) {
          // Modulate heights using multiple sine waves for a organic audio-like dance
          const wave1 = Math.sin(i * 0.15 + phaseRef.current) * 0.15;
          const wave2 = Math.cos(i * 0.08 - phaseRef.current * 0.7) * 0.1;
          hPercent = Math.max(0.1, hPercent + wave1 + wave2);
        }

        const barHeight = hPercent * height * 0.8;
        const x = i * (barWidth + barGap);
        const y = (height - barHeight) / 2;

        // Set bar color based on progress and active theme
        const isActive = i <= activeBarCount;
        if (isActive) {
          // Active bar styling (solid white in dark/glass theme, dark grey in light theme)
          if (theme === 'light') {
            ctx.fillStyle = 'rgba(29, 29, 31, 0.85)';
          } else {
            ctx.fillStyle = '#ffffff';
          }
        } else {
          // Inactive bar styling (dim/translucent)
          if (theme === 'light') {
            ctx.fillStyle = 'rgba(29, 29, 31, 0.15)';
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          }
        }

        // Draw rounded rectangle for each bar
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
        } else {
          ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();
      }

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    // Trigger initial draw
    draw();

    // Re-adjust on resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      draw();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying, currentTime, duration, theme]);

  return (
    <div className="waveform-section">
      <canvas ref={canvasRef} className="waveform-canvas" />
    </div>
  );
};

export default Waveform;
