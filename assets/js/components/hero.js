// Created by Ali Zaghloul on 16/09/2026
/**
 * Hero: constellation canvas (nodes + links reacting to the pointer),
 * depth parallax for chips / code / blobs, and a typed role rotator.
 * Budget: ≤ 70 nodes on desktop, 28 on mobile, paused when off-screen.
 */
import { $, $$, prefersReducedMotion, isTouch, lerp, rafThrottle } from '../core/env.js';

const ROLES = ['Senior iOS Engineer', 'Swift · UIKit · SwiftUI', 'Offline-first POS Builder', 'MVVM + Combine Advocate', 'Real-time Sync Engineer'];

function accentRGB() {
  return getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim() || '94,225,255';
}

function initCanvas() {
  const canvas = $('#heroCanvas');
  if (!canvas || prefersReducedMotion) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  const hero = canvas.parentElement;
  let w = 0, h = 0, dpr = 1, nodes = [], running = true, rgb = accentRGB();
  const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
  const COUNT = isTouch ? 28 : 70;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth; h = hero.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    nodes = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: 1 + Math.random() * 1.6,
    }));
  };
  resize();
  window.addEventListener('resize', rafThrottle(resize));
  document.addEventListener('themechange', () => { rgb = accentRGB(); });

  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    pointer.tx = e.clientX - r.left; pointer.ty = e.clientY - r.top;
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointer.tx = -9999; pointer.ty = -9999; });

  const draw = () => {
    if (!running) return;
    pointer.x = lerp(pointer.x, pointer.tx, 0.12);
    pointer.y = lerp(pointer.y, pointer.ty, 0.12);
    ctx.clearRect(0, 0, w, h);
    const LINK = isTouch ? 110 : 140;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      /* pointer attraction */
      const dx = pointer.x - n.x, dy = pointer.y - n.y, d2 = dx * dx + dy * dy;
      if (d2 < 220 * 220) { n.vx += dx * 0.00004; n.vy += dy * 0.00004; }
      n.x += n.vx; n.y += n.vy;
      n.vx *= 0.995; n.vy *= 0.995;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb},0.55)`; ctx.fill();
      for (let j = i + 1; j < nodes.length; j++) {
        const m = nodes[j];
        const ddx = n.x - m.x, ddy = n.y - m.y, dist = Math.hypot(ddx, ddy);
        if (dist < LINK) {
          ctx.strokeStyle = `rgba(${rgb},${(1 - dist / LINK) * 0.22})`;
          ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
        }
      }
      /* link to pointer */
      if (d2 < 180 * 180) {
        ctx.strokeStyle = `rgba(${rgb},${(1 - Math.sqrt(d2) / 180) * 0.5})`;
        ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  };

  /* Pause when hero leaves the viewport or the tab is hidden */
  const io = new IntersectionObserver(([e]) => {
    const shouldRun = e.isIntersecting && !document.hidden;
    if (shouldRun && !running) { running = true; requestAnimationFrame(draw); }
    else if (!shouldRun) running = false;
  }, { threshold: 0.05 });
  io.observe(hero);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) running = false;
    else if (!running) { running = true; requestAnimationFrame(draw); }
  });
  requestAnimationFrame(draw);
}

function initParallax() {
  if (prefersReducedMotion || isTouch) return;
  const hero = $('#top');
  const layers = $$('[data-depth]', hero);
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
  const render = () => {
    cx = lerp(cx, tx, 0.08); cy = lerp(cy, ty, 0.08);
    layers.forEach((l) => {
      const d = parseFloat(l.dataset.depth) * 400;
      l.style.transform = `translate3d(${cx * d}px, ${cy * d}px, 0)`;
    });
    if (Math.abs(cx - tx) > 0.001 || Math.abs(cy - ty) > 0.001) raf = requestAnimationFrame(render); else raf = null;
  };
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5;
    if (!raf) raf = requestAnimationFrame(render);
  }, { passive: true });
}

function initRoles() {
  const el = $('#roleText');
  if (!el) return;
  if (prefersReducedMotion) { el.textContent = ROLES[0]; return; }
  let idx = 0;
  const type = async () => {
    const word = ROLES[idx];
    for (let i = 0; i <= word.length; i++) { el.textContent = word.slice(0, i); await wait(38); }
    await wait(1900);
    for (let i = word.length; i >= 0; i--) { el.textContent = word.slice(0, i); await wait(18); }
    idx = (idx + 1) % ROLES.length;
    type();
  };
  wait(1400).then(type);
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function initHero() {
  initCanvas();
  initParallax();
  initRoles();
}
