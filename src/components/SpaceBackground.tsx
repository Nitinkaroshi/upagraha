import { useEffect, useRef } from 'react';

/**
 * Full-screen animated space background with stars and shooting stars.
 * Uses Canvas for smooth 60fps animation with minimal performance impact.
 */
export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    let animationId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // Stars
    interface Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      twinkleSpeed: number;
      twinkleOffset: number;
    }

    interface ShootingStar {
      x: number;
      y: number;
      len: number;
      speed: number;
      angle: number;
      opacity: number;
      life: number;
      maxLife: number;
    }

    const stars: Star[] = [];
    const shootingStars: ShootingStar[] = [];
    const STAR_COUNT = Math.min(300, Math.floor((width * height) / 5000));

    // Generate stars
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.6 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    function spawnShootingStar() {
      if (shootingStars.length >= 2) return;
      shootingStars.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        len: 60 + Math.random() * 100,
        speed: 8 + Math.random() * 12,
        angle: Math.PI / 6 + Math.random() * 0.3,
        opacity: 0.7 + Math.random() * 0.3,
        life: 0,
        maxLife: 40 + Math.random() * 30,
      });
    }

    let time = 0;
    let lastShootingStar = 0;

    function animate() {
      time++;
      ctx.clearRect(0, 0, width, height);

      // Draw stars with twinkling
      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const opacity = star.opacity * (0.6 + twinkle * 0.4);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.02, opacity)})`;
        ctx.fill();
      });

      // Shooting stars
      if (time - lastShootingStar > 300 + Math.random() * 500) {
        spawnShootingStar();
        lastShootingStar = time;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.life++;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;

        const progress = s.life / s.maxLife;
        const fadeIn = Math.min(progress * 5, 1);
        const fadeOut = 1 - Math.pow(progress, 2);
        const alpha = s.opacity * fadeIn * fadeOut;

        if (alpha > 0.01) {
          const tailX = s.x - Math.cos(s.angle) * s.len * fadeOut;
          const tailY = s.y - Math.sin(s.angle) * s.len * fadeOut;

          const gradient = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
          gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
          gradient.addColorStop(1, `rgba(255, 255, 255, ${alpha})`);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(s.x, s.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Head glow
          ctx.beginPath();
          ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
          ctx.fill();
        }

        if (s.life >= s.maxLife || s.x > width + 100 || s.y > height + 100) {
          shootingStars.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
