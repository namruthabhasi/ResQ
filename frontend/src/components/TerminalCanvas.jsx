import React, { useRef, useEffect, useState } from 'react';

export default function TerminalCanvas({ isInputFocused, inputRect, triggerSubmitAnimation, onSubmitAnimationEnd }) {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const [particles, setParticles] = useState([]);
  const animFrameId = useRef(null);

  // Singularity collapse state variables
  const isCollapsing = useRef(false);
  const collapseCenter = useRef({ x: 0, y: 0 });
  const collapseProgress = useRef(0);
  const activeParticles = useRef([]);

  // Monitor mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle trigger submit singularity animation
  useEffect(() => {
    if (triggerSubmitAnimation && inputRect) {
      isCollapsing.current = true;
      collapseProgress.current = 0;
      // Define singularity center right below the input box
      collapseCenter.current = {
        x: inputRect.left + inputRect.width / 2,
        y: inputRect.bottom + 25
      };

      // Generate spiral particles
      const newParticles = [];
      const numParticles = 120;
      for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 100 + Math.random() * 250; // spawn at a distance
        newParticles.push({
          angle: angle,
          radius: radius,
          speed: 2 + Math.random() * 4,
          spiralRate: 0.04 + Math.random() * 0.04,
          size: 1 + Math.random() * 2,
          color: Math.random() > 0.4 ? '#00f0ff' : '#10b981', // cyan and green mix
          opacity: 0.8
        });
      }
      activeParticles.current = newParticles;
    }
  }, [triggerSubmitAnimation, inputRect]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      const gridSpacing = 45;

      // --- Draw Grid ---
      ctx.lineWidth = 1;

      // Draw vertical and horizontal grid lines with warping effects
      const focusX = inputRect ? inputRect.left + inputRect.width / 2 : width / 2;
      const focusY = inputRect ? inputRect.top + inputRect.height / 2 : height / 2;
      const warpRadius = 250; // influence area

      // Draw Grid Points
      for (let x = 0; x < width; x += gridSpacing) {
        for (let y = 0; y < height; y += gridSpacing) {
          let drawX = x;
          let drawY = y;

          // 1. Mouse Gravitational Attraction (Subtle displacement toward cursor)
          const mouseDx = mousePos.current.x - x;
          const mouseDy = mousePos.current.y - y;
          const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
          if (mouseDist < 200 && mouseDist > 10) {
            const force = (200 - mouseDist) / 10;
            drawX += (mouseDx / mouseDist) * force;
            drawY += (mouseDy / mouseDist) * force;
          }

          // 2. Gravitational Lens Warping (Bends grid points towards input box when focused)
          if (isInputFocused && inputRect) {
            const dx = focusX - x;
            const dy = focusY - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < warpRadius && dist > 1) {
              // Gravitational attraction formula: pull points toward the focused center
              const pullStrength = Math.pow((warpRadius - dist) / warpRadius, 2.5) * 45;
              drawX += (dx / dist) * pullStrength;
              drawY += (dy / dist) * pullStrength;
            }
          }

          // Draw small coordinate node cross or dot
          ctx.fillStyle = 'rgba(0, 240, 255, 0.04)';
          ctx.fillRect(drawX - 1, drawY - 1, 2, 2);

          // Draw coordinates text in margins (very low opacity)
          if (x % (gridSpacing * 6) === 0 && y % (gridSpacing * 6) === 0) {
            ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
            ctx.font = '8px monospace';
            ctx.fillText(`[${x},${y}]`, drawX + 4, drawY - 4);
          }
        }
      }

      // Draw faint lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.012)';
      ctx.beginPath();
      // Draw bent grid lines
      for (let x = 0; x < width; x += gridSpacing * 2) {
        ctx.moveTo(x, 0);
        for (let y = 0; y < height; y += 15) {
          let drawX = x;
          let drawY = y;
          // Apply same warping logic
          if (isInputFocused && inputRect) {
            const dx = focusX - x;
            const dy = focusY - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < warpRadius && dist > 1) {
              const pullStrength = Math.pow((warpRadius - dist) / warpRadius, 2.5) * 35;
              drawX += (dx / dist) * pullStrength;
            }
          }
          ctx.lineTo(drawX, drawY);
        }
      }
      ctx.stroke();

      // --- Singularity Collapse Particles ---
      if (isCollapsing.current) {
        let allInside = true;
        const center = collapseCenter.current;

        activeParticles.current.forEach((p) => {
          // Spiraling towards center: reduce radius and rotate angle
          p.radius -= p.speed;
          p.angle += p.spiralRate;
          p.speed += 0.15; // acceleration

          const px = center.x + Math.cos(p.angle) * p.radius;
          const py = center.y + Math.sin(p.angle) * p.radius;

          if (p.radius > 2) {
            allInside = false;
            
            // Draw particle
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 4;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0; // reset shadow
          }
        });

        if (allInside) {
          isCollapsing.current = false;
          activeParticles.current = [];
          if (onSubmitAnimationEnd) onSubmitAnimationEnd();
        }
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isInputFocused, inputRect, triggerSubmitAnimation]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
