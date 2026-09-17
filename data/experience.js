// Created by Ali Zaghloul on 16/09/2026
/** Career timeline + education. Entries render alternating left/right. */

export const experience = [
  {
    period: 'Sep 2025 — Present',
    location: 'Riyadh, Saudi Arabia',
    company: 'Jahez Group — Marn',
    position: 'Senior iOS Engineer',
    summary: 'Building Marn Cloud POS — the three-app point-of-sale suite running restaurants and retail across Saudi Arabia.',
    highlights: [
      'Own real-time order flows across POS, kitchen and customer displays via SignalR.',
      'Maintain the offline-first sync engine: Core Data pipeline, background queue recovery.',
      'Build pricing, discount and VAT engines that must match the backend to the halala.',
      'Integrate SUNMI, Zebra and Star printers and barcode scanners behind testable protocols.',
    ],
    stack: ['Swift', 'UIKit', 'SwiftUI', 'Combine', 'Core Data', 'SignalR'],
  },
  {
    period: 'Sep 2024 — Sep 2025',
    location: 'Riyadh, Saudi Arabia',
    company: 'SAMI-AEC',
    position: 'Senior iOS Engineer',
    summary: 'Delivered Mawqfi and Riyadh Parking for the Riyadh Municipality — the capital’s public parking apps.',
    highlights: [
      'Led the legacy MVC → MVVM + RxSwift migration while releases kept shipping.',
      'Drove crash rates down release over release with systematic triage.',
      'Added offline support for map, zone and session data.',
    ],
    stack: ['Swift', 'UIKit', 'RxSwift', 'MVVM', 'MapKit'],
  },
  {
    period: 'Mar 2023 — Sep 2024',
    location: 'Cairo, Egypt',
    company: 'Ayamedica',
    position: 'Mid-Level iOS Engineer',
    summary: 'Health-tech: secure child-health records for parents and schools, plus Swipy digital business cards.',
    highlights: [
      'Led the MVVM + RxSwift migration of Ayamedica and Swipy, cutting technical debt.',
      'Took both apps from concept to production — API integrations, pixel-perfect UI.',
      'Owned App Store releases end to end.',
    ],
    stack: ['Swift', 'UIKit', 'RxSwift', 'GraphQL', 'Core Data'],
  },
  {
    period: 'Feb 2023 — Dec 2023',
    location: 'Remote',
    company: 'NationTech',
    position: 'iOS Developer (part-time)',
    summary: 'Built NGChat — enterprise real-time messaging — and Green Matter, from scratch to deployment.',
    highlights: [
      'Designed modular layouts and custom networking layers to enterprise standards.',
      'Shipped secure media sharing and live location broadcasting.',
    ],
    stack: ['Swift', 'UIKit', 'Realm', 'Firestore', 'MapKit'],
  },
  {
    period: 'Jan 2022 — Feb 2023',
    location: 'Cairo, Egypt',
    company: 'SemiColon Ltd',
    position: 'iOS Developer',
    summary: 'First production years: the TON logistics ecosystem and Moqawalat Masr, built and shipped from scratch.',
    highlights: [
      'Built TON Client and Driver — live location tracking and in-ride messaging.',
      'Developed and shipped Moqawalat Masr, owning the full App Store submission.',
    ],
    stack: ['Swift', 'UIKit', 'MapKit', 'Firebase', 'REST'],
  },
];

export const education = [
  { title: 'B.S.E. Computer Science Engineering', org: 'Operating systems, databases, algorithms — the fundamentals under all of it.', year: 'Sep 2016 — Jul 2020' },
  { title: 'Graduation project — Ylaa Khair', org: 'An iOS + Android charity platform, built end-to-end. Graded Excellent.', year: '2020' },
];
