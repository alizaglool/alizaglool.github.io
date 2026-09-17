// Created by Ali Zaghloul on 16/09/2026
/**
 * Contact form: inline validation, honeypot, optional POST to a form
 * backend (site.formEndpoint); otherwise composes a mailto: draft.
 */
import { site } from '../../../data/site.js';
import { $, $$, toast } from '../core/env.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(form) {
  let ok = true;
  $$('.field', form).forEach((f) => {
    const input = f.querySelector('input, textarea');
    let valid = input.value.trim().length >= (parseInt(input.getAttribute('minlength'), 10) || 1);
    if (input.type === 'email') valid = EMAIL_RE.test(input.value.trim());
    f.classList.toggle('is-invalid', !valid);
    input.setAttribute('aria-invalid', String(!valid));
    if (!valid) ok = false;
  });
  return ok;
}

export function initContact() {
  const form = $('#contactForm');
  const status = $('#formStatus');
  if (!form) return;

  $$('input, textarea', form).forEach((i) => i.addEventListener('input', () => i.closest('.field')?.classList.remove('is-invalid')));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form._gotcha?.value) return; /* bot */
    if (!validate(form)) { status.textContent = 'Please fix the highlighted fields.'; $('.is-invalid input, .is-invalid textarea', form)?.focus(); return; }

    const data = Object.fromEntries(new FormData(form).entries());
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;

    if (site.formEndpoint) {
      status.textContent = 'Sending…';
      try {
        const res = await fetch(site.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error(res.status);
        status.textContent = 'Thanks — your message is on its way. I’ll reply soon.';
        form.reset(); toast('Message sent');
      } catch {
        status.textContent = 'Could not send right now — opening your email client instead.';
        openMailto(data);
      }
    } else {
      openMailto(data);
      status.textContent = 'Your email client should open with the message pre-filled.';
    }
    btn.disabled = false;
  });
}

function openMailto({ name, email, subject, message }) {
  const body = `${message}\n\n— ${name} (${email})`;
  location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
