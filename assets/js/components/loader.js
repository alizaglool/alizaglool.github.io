// Created by Ali Zaghloul on 16/09/2026
/** Sub-second boot screen: name → progress → reveal. Never blocks > 1.2s. */
import { $ } from '../core/env.js';

export function initLoader() {
  const loader = $('#loader');
  const bar = $('#loaderBar');
  const status = $('#loaderStatus');
  if (!loader) return Promise.resolve();

  const steps = ['booting', 'loading assets', 'wiring view models', 'ready'];
  let i = 0;
  const tick = setInterval(() => {
    i = Math.min(i + 1, steps.length - 1);
    status.textContent = steps[i];
    bar.style.width = `${(i / (steps.length - 1)) * 100}%`;
  }, 160);

  const finish = () =>
    new Promise((resolve) => {
      clearInterval(tick);
      bar.style.width = '100%';
      status.textContent = 'ready';
      setTimeout(() => {
        loader.classList.add('is-done');
        loader.addEventListener('transitionend', () => loader.remove(), { once: true });
        resolve();
      }, 180);
    });

  const minDelay = new Promise((r) => setTimeout(r, 650));
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  const hardCap = new Promise((r) => setTimeout(r, 1200));
  return Promise.race([Promise.all([minDelay, fontsReady]), hardCap]).then(finish);
}
