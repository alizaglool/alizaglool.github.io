// Created by Ali Zaghloul on 16/09/2026
/** Easter egg: press ~ (or type "help" in the console) to open a tiny shell. */
import { site } from '../../../data/site.js';
import { projects } from '../../../data/projects.js';
import { $, esc } from '../core/env.js';
import { openProject } from './projects.js';

const COMMANDS = {
  help: () => 'commands: whoami · projects · open <id> · stack · contact · theme · clear · exit',
  whoami: () => `${site.name} — ${site.title}\n${site.location} · ${site.email}`,
  projects: () => projects.map((p) => `${p.id.padEnd(16)} ${p.status.padEnd(14)} ${p.name}`).join('\n'),
  stack: () => 'swift · uikit · swiftui · combine · rxswift · core data · realm · signalr · firebase',
  contact: () => `email: ${site.email}\nwhatsapp: ${site.whatsapp}\nlinkedin: ${site.linkedin}`,
  theme: () => { $('#themeToggle')?.click(); return 'theme toggled'; },
  clear: (t) => { t.body.innerHTML = ''; return ''; },
  exit: (t) => { t.close(); return ''; },
  sudo: () => 'nice try 🙂',
  swift: () => 'Swift · Xcode — "Offline-first, sync always."',
};

export function initTerminal() {
  const el = $('#terminal');
  const body = $('#terminalBody');
  const form = $('#terminalForm');
  const input = $('#terminalInput');
  if (!el) return;

  const t = { body, close: () => { el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true'); } };
  const print = (cmd, out) => {
    body.insertAdjacentHTML('beforeend', `<div><span class="p">❯</span> ${esc(cmd)}</div>${out ? `<div>${esc(out)}</div>` : ''}`);
    body.scrollTop = body.scrollHeight;
  };
  const open = () => {
    el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false');
    if (!body.textContent.trim()) print('welcome', 'Hi, curious one. Type "help" to see commands.');
    input.focus();
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === '~' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) { e.preventDefault(); el.classList.contains('is-open') ? t.close() : open(); }
    if (e.key === 'Escape' && el.classList.contains('is-open')) t.close();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = input.value.trim(); input.value = '';
    if (!raw) return;
    const [cmd, ...args] = raw.split(/\s+/);
    if (cmd === 'open') { const id = args[0]; if (projects.some((p) => p.id === id)) { print(raw, `opening ${id}…`); openProject(id); } else print(raw, `unknown project "${id}" — try "projects"`); return; }
    const fn = COMMANDS[cmd];
    print(raw, fn ? fn(t) : `command not found: ${cmd}`);
  });

  console.log('%cBuilt with Swift & lots of coffee. Press ~ on the page for a terminal.', 'color:#5ee1ff;font-family:monospace;font-size:13px');
}
