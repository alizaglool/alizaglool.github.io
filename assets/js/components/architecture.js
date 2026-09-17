// Created by Ali Zaghloul on 16/09/2026
/**
 * "How I build" — animated system diagram (SVG). Links draw on scroll,
 * data particles flow along paths, hover highlights a node's connections,
 * click shows implementation notes from real projects.
 */
import { $, $$, esc, prefersReducedMotion } from '../core/env.js';
import { onceVisible } from '../core/reveal.js';

const NODES = [
  { id: 'ui', x: 280, y: 30, w: 260, label: 'UI · Views', sub: 'UIKit / SwiftUI', desc: 'Screens are thin. They render state and forward user intent — no networking, no persistence, no business rules.', points: ['UIKit and SwiftUI screens bind to the same ViewModels, so views migrate one at a time (Marn POS login, Orders).', 'Diffable data sources + Auto Layout keep long order lists at 60fps on POS hardware.', 'Arabic-first: every screen ships RTL and LTR, with strings resolved in the ViewModel.'], code: 'viewModel.$state\n  .receive(on: DispatchQueue.main)\n  .sink { [weak self] state in\n    self?.render(state)\n  }\n  .store(in: &cancellables)' },
  { id: 'vm', x: 280, y: 150, w: 260, label: 'ViewModel', sub: 'Combine / RxSwift', desc: 'ViewModels subscribe to repository publishers and expose immutable state. They never touch URLSession, Core Data or SignalR directly.', points: ['State enums with loading / loaded / error cases — no optional soup.', 'Combine on Marn POS, RxSwift on the parking and health apps — same shape, different engine.', 'Unit-tested with fake repositories; money paths get the densest coverage.'], code: 'final class OrdersViewModel {\n  @Published private(set) var state: State = .loading\n\n  init(repo: OrderRepository) {\n    repo.ordersPublisher\n      .map(State.loaded)\n      .catch { Just(State.error($0)) }\n      .assign(to: &$state)\n  }\n}' },
  { id: 'repo', x: 280, y: 270, w: 260, label: 'Repository', sub: 'single source of truth', desc: 'Repositories hide where data lives. They return typed results and publish streams, so the UI is always reactive and always consistent.', points: ['Every remote call goes through a safe wrapper → Result<T, AppError>.', 'Local-first: write to Core Data in one transaction, then enqueue a sync operation.', 'Publishers replay the latest value so late subscribers render instantly.'], code: 'func commit(_ draft: CartDraft) async -> Result<Order, AppError> {\n  await safeCall {\n    try await store.write { ctx in\n      let order = try draft.insert(into: ctx)\n      try outbox.enqueue(.order(order), in: ctx)\n      return order\n    }\n  } onSuccess: { sync.kick() }   // offline-first\n}' },
  { id: 'api', x: 10, y: 410, w: 240, label: 'REST · SignalR', sub: 'URLSession · hubs', desc: 'A URLSession client with token-refresh handling talks REST; SignalR hubs push order events to every device on the floor.', points: ['Queued token refresh — one refresh in flight, waiting requests replay after it.', 'Delta-based, idempotent sync: replaying an operation twice can never double a sale.', 'SignalR events invalidate local state so other devices re-render in real time.'], code: 'hub.on("OrderUpdated") { [weak self] payload in\n  guard let delta = try? decoder.decode(\n    OrderDelta.self, from: payload\n  ) else { return }\n  self?.store.apply(delta)  // UI updates via publishers\n}' },
  { id: 'db', x: 290, y: 410, w: 240, label: 'Local store', sub: 'Core Data · Realm', desc: 'The device database is the source of truth. Sales commit locally first, so the counter keeps moving when the network drops.', points: ['Core Data on Marn POS with background contexts and a serial write queue.', 'Realm on the kitchen display for high-frequency ticket updates.', 'A sync outbox table preserves operation order across app restarts.'], code: 'func write<T>(\n  _ op: @escaping (NSManagedObjectContext) throws -> T\n) async throws -> T {\n  try await queue.run {\n    try background.performAndWait { try op(background) }\n  }\n}' },
  { id: 'services', x: 570, y: 410, w: 240, label: 'Device services', sub: 'print · scan · push', desc: 'Hardware and platform integrations live behind small protocols, so features are testable without a printer on the desk.', points: ['SUNMI, Zebra and Star receipt printers + barcode scanners behind one PrintingService.', 'APNs / FCM push, biometrics and secure storage as injectable services.', 'A failed print is queued and retried — it never blocks the sale.'], code: 'protocol PrintingService {\n  func printReceipt(_ order: Order) async throws\n  func printKitchenTicket(_ ticket: Ticket) async throws\n}' },
];

const LINKS = [
  ['ui', 'vm'], ['vm', 'repo'], ['repo', 'api'], ['repo', 'db'], ['repo', 'services'],
];

const center = (n) => ({ x: n.x + n.w / 2, y: n.y + 30 });

function pathFor(a, b) {
  const A = center(a), B = center(b);
  const y1 = a.y + 60, y2 = b.y;
  const midY = (y1 + y2) / 2;
  return `M ${A.x} ${y1} C ${A.x} ${midY}, ${B.x} ${midY}, ${B.x} ${y2}`;
}

function svgMarkup() {
  const links = LINKS.map(([a, b], i) => {
    const d = pathFor(NODES.find((n) => n.id === a), NODES.find((n) => n.id === b));
    return `<path class="link" id="link-${a}-${b}" data-a="${a}" data-b="${b}" d="${d}" style="--i:${i}"/>`;
  }).join('');
  const nodes = NODES.map((n, i) => `
    <g class="node" data-id="${n.id}" style="--i:${i}" tabindex="0" role="button" aria-label="${esc(n.label)}: ${esc(n.desc)}">
      <rect x="${n.x}" y="${n.y}" width="${n.w}" height="60" rx="14"/>
      <text x="${n.x + n.w / 2}" y="${n.y + 27}" text-anchor="middle">${esc(n.label)}</text>
      <text class="sub" x="${n.x + n.w / 2}" y="${n.y + 46}" text-anchor="middle">${esc(n.sub)}</text>
    </g>`).join('');
  return `<svg viewBox="0 0 820 490" role="group" aria-label="Data flow: UI → ViewModel → Repository → API, local store and device services">${links}${nodes}<g id="particles"></g></svg>`;
}

function spawnParticles(svg) {
  if (prefersReducedMotion) return;
  const g = svg.querySelector('#particles');
  const ns = 'http://www.w3.org/2000/svg';
  LINKS.forEach(([a, b], i) => {
    for (let k = 0; k < 2; k++) {
      const rev = k === 1;
      const c = document.createElementNS(ns, 'circle');
      c.setAttribute('r', '3'); c.setAttribute('class', `particle${rev ? ' rev' : ''}`);
      const m = document.createElementNS(ns, 'animateMotion');
      m.setAttribute('dur', `${2.6 + (i % 3) * 0.5}s`); m.setAttribute('repeatCount', 'indefinite');
      m.setAttribute('begin', `${(i * 0.4 + k * 1.3).toFixed(1)}s`);
      if (rev) m.setAttribute('keyPoints', '1;0'), m.setAttribute('keyTimes', '0;1'), m.setAttribute('calcMode', 'linear');
      const mp = document.createElementNS(ns, 'mpath');
      mp.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#link-${a}-${b}`);
      mp.setAttribute('href', `#link-${a}-${b}`);
      m.appendChild(mp); c.appendChild(m); g.appendChild(c);
    }
  });
}

function renderPanel(panel, n) {
  panel.innerHTML = `
    <span class="mono">${esc(n.sub)}</span>
    <h3>${esc(n.label)}</h3>
    <p>${esc(n.desc)}</p>
    <ul>${n.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
    <code tabindex="0" aria-label="Code example">${esc(n.code)}</code>`;
}

export function initArchitecture() {
  const host = $('#arch');
  const panel = $('#archPanel');
  if (!host || !panel) return;
  host.innerHTML = svgMarkup() + '<div class="arch__hint"><span><i style="background:var(--accent)"></i>requests / writes</span><span><i style="background:var(--accent-2)"></i>state / streams back to the UI</span><span>hover to trace · click for details</span></div>';
  const svg = host.querySelector('svg');
  renderPanel(panel, NODES[2]);
  $$('.node', svg).find((n) => n.dataset.id === 'repo')?.classList.add('is-active');

  onceVisible(host, () => { host.classList.add('is-visible'); setTimeout(() => spawnParticles(svg), prefersReducedMotion ? 0 : 900); }, { threshold: 0.25 });

  const highlight = (id) => {
    const connected = new Set([id]);
    LINKS.forEach(([a, b]) => { if (a === id) connected.add(b); if (b === id) connected.add(a); });
    $$('.node', svg).forEach((n) => n.classList.toggle('is-dim', !connected.has(n.dataset.id)));
    $$('.link', svg).forEach((l) => { const on = l.dataset.a === id || l.dataset.b === id; l.classList.toggle('is-active', on); l.classList.toggle('is-dim', !on); });
  };
  const clear = () => { $$('.node, .link', svg).forEach((el) => el.classList.remove('is-dim', 'is-active')); $$('.node', svg).find((n) => n.dataset.id === selected)?.classList.add('is-active'); };
  let selected = 'repo';

  svg.addEventListener('pointerover', (e) => { const n = e.target.closest('.node'); if (n) highlight(n.dataset.id); });
  svg.addEventListener('pointerleave', clear);
  const select = (n) => { selected = n.dataset.id; renderPanel(panel, NODES.find((x) => x.id === selected)); clear(); highlight(selected); };
  svg.addEventListener('click', (e) => { const n = e.target.closest('.node'); if (n) select(n); });
  svg.addEventListener('keydown', (e) => { const n = e.target.closest('.node'); if (n && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); select(n); } });
  svg.addEventListener('focusin', (e) => { const n = e.target.closest('.node'); if (n) highlight(n.dataset.id); });
}
