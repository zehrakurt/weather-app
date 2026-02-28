import { useEffect, useRef } from "react";

// Mevcut tema renkleri (CSS)
const COLORS = [
  "rgba(45, 54, 68, 0.8)",   // #2d3644
  "rgba(61, 74, 92, 0.75)",  // #3d4a5c
  "rgba(74, 122, 184, 0.6)", // #4a7ab8
  "rgba(30, 37, 48, 0.85)",  // #1e2530
];

const PARTICLE_COUNT = 280;
const SPEED = 0.12;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
};

export default function BackgroundScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let start = 0;
    const particles: Particle[] = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(dpr, dpr);
    }

    function init() {
      particles.length = 0;
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: 0,
          vy: 0,
          size: 1.2 + Math.random() * 1.2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    }

    function animate(t: number) {
      animationId = requestAnimationFrame(animate);
      if (!start) start = t;
      const time = (t - start) * 0.001 * SPEED;

      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.vx = Math.sin(time + i * 0.01) * 0.4;
        p.vy = Math.cos(time * 0.7 + i * 0.008) * 0.3;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.x = (p.x + w) % w;
        if (p.y < 0 || p.y > h) p.y = (p.y + h) % h;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
    }

    resize();
    init();
    animationId = requestAnimationFrame(animate);

    window.addEventListener("resize", () => {
      resize();
      init();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="background-scene" aria-hidden="true" />;
}
