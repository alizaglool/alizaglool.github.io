// Created by Ali Zaghloul on 16/09/2026
/**
 * Micro-interactions shared across sections:
 *  - magnetic buttons        [data-magnetic]
 *  - 3D tilt + spotlight     .tilt / .spotlight (pointer position → CSS vars)
 *  - copy-to-clipboard       [data-copy]
 */
import { $$, isFinePointer, prefersReducedMotion, toast, clamp } from '../core/env.js';

export function initMagnetic(root = document) {
  if (!isFinePointer || prefersReducedMotion) return;
  $$('[data-magnetic]', root).forEach((el) => {
    const strength = 0.35;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

export function initTilt(root = document) {
  if (!isFinePointer || prefersReducedMotion) return;
  $$('.tilt', root).forEach((el) => {
    const max = parseFloat(el.dataset.tilt || 8);
    el.addEventListener('pointerenter', () => el.classList.add('is-active'));
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      const rx = clamp((0.5 - py) * max * 2, -max, max), ry = clamp((px - 0.5) * max * 2, -max, max);
      el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      el.style.setProperty('--mx', `${px * 100}%`); el.style.setProperty('--my', `${py * 100}%`);
      el.style.setProperty('--px', px - 0.5); el.style.setProperty('--py', py - 0.5);
    });
    el.addEventListener('pointerleave', () => { el.classList.remove('is-active'); el.style.transform = ''; });
  });
  $$('.spotlight:not(.tilt)', root).forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });
}

export function initCopy(root = document) {
  $$('[data-copy]', root).forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault(); e.stopPropagation();
      try { await navigator.clipboard.writeText(btn.dataset.copy); toast('Copied to clipboard'); }
      catch { toast(btn.dataset.copy); }
    });
  });
}
