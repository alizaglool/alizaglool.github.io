// Created by Ali Zaghloul on 16/09/2026
/** Environment flags & tiny helpers shared by every module. */
export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
export const isTouch = !isFinePointer;

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
export const lerp = (a, b, t) => a + (b - a) * t;

/** Escape text before injecting into innerHTML. */
export const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** rAF-throttled handler (one call per frame max). */
export function rafThrottle(fn) {
  let ticking = false;
  let lastArgs;
  return (...args) => {
    lastArgs = args;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      fn(...lastArgs);
    });
  };
}

let toastTimer;
export function toast(message) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2200);
}
