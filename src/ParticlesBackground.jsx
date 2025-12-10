import React, { useRef, useEffect } from 'react';

const ParticlesBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const DPR = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth * DPR;
      canvas.height = innerHeight * DPR;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particle
    function createParticle() {
      const w = window.innerWidth;
      const h = window.innerHeight;

      const x = Math.random() * w;
      const y = Math.random() * h;

      // Soft float upward
      const speed = 0.1 + Math.random() * 0.25;
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;

      const vx = Math.cos(angle) * speed * 0.5;
      const vy = Math.sin(angle) * speed;

      return {
        x,
        y,
        vx,
        vy,
        radius: 0.7 + Math.random() * 1.6,
        alpha: 0.15 + Math.random() * 0.4,
      };
    }

    const particles = Array.from({ length: 250 }, createParticle);
    particlesRef.current = particles;

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.fillRect(0, 0, w, h);

      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Respawn when above screen
        if (p.y < -20 || p.x < -20 || p.x > w + 20) {
          const np = createParticle();
          p.x = np.x;
          p.y = h + 10; // spawn from bottom
          p.vx = np.vx;
          p.vy = np.vy;
          p.radius = np.radius;
          p.alpha = np.alpha;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        // White glowing spores
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="particles-canvas" />
  );
};

export default ParticlesBackground;
