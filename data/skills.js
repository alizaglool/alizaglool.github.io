// Created by Ali Zaghloul on 16/09/2026
/**
 * Skill cloud data. level: 'core' (daily driver) · 'strong' (shipped in
 * production) · 'used' (applied in at least one project).
 * projects: ids from data/projects.js — powers the related-projects panel.
 */

export const skillGroups = [
  {
    id: 'ui',
    label: 'Language & UI',
    skills: [
      { name: 'Swift', level: 'core', projects: ['marn-pos', 'riyadh-parking', 'mawqfi', 'emle', 'ayamedica', 'swipy', 'ton', 'moqawalat', 'ngchat', 'ylaa-khair'] },
      { name: 'UIKit', level: 'core', projects: ['marn-pos', 'riyadh-parking', 'mawqfi', 'ayamedica', 'swipy', 'ton', 'moqawalat', 'ngchat'] },
      { name: 'SwiftUI', level: 'core', projects: ['marn-pos', 'emle'] },
      { name: 'Combine', level: 'core', projects: ['marn-pos', 'emle'] },
      { name: 'RxSwift', level: 'strong', projects: ['riyadh-parking', 'mawqfi', 'ayamedica', 'swipy'] },
      { name: 'Auto Layout', level: 'core', projects: ['marn-pos', 'riyadh-parking', 'mawqfi', 'ayamedica', 'swipy', 'ton'] },
      { name: 'Arabic RTL & l10n', level: 'core', projects: ['marn-pos', 'riyadh-parking', 'mawqfi', 'moqawalat'] },
    ],
  },
  {
    id: 'arch',
    label: 'Architecture',
    skills: [
      { name: 'MVVM', level: 'core', projects: ['marn-pos', 'riyadh-parking', 'mawqfi', 'ayamedica', 'swipy', 'emle'] },
      { name: 'Coordinators', level: 'strong', projects: ['marn-pos', 'emle'] },
      { name: 'Clean Architecture / SOLID', level: 'strong', projects: ['marn-pos', 'ayamedica', 'emle'] },
      { name: 'Legacy MVC migrations', level: 'strong', projects: ['riyadh-parking', 'mawqfi', 'ayamedica', 'swipy'] },
      { name: 'VIPER', level: 'used', projects: ['ngchat'] },
      { name: 'SPM modularisation', level: 'strong', projects: ['marn-pos', 'emle'] },
      { name: 'Unit testing (XCTest)', level: 'strong', projects: ['marn-pos', 'emle'] },
    ],
  },
  {
    id: 'data',
    label: 'Data & Sync',
    skills: [
      { name: 'Core Data', level: 'core', projects: ['marn-pos', 'ayamedica', 'moqawalat'] },
      { name: 'Realm', level: 'strong', projects: ['marn-pos', 'ngchat'] },
      { name: 'Offline-first sync', level: 'core', projects: ['marn-pos', 'riyadh-parking', 'mawqfi', 'emle'] },
      { name: 'SignalR / WebSockets', level: 'strong', projects: ['marn-pos'] },
      { name: 'REST APIs', level: 'core', projects: ['marn-pos', 'riyadh-parking', 'mawqfi', 'ayamedica', 'swipy', 'ton', 'moqawalat', 'ngchat', 'emle'] },
      { name: 'GraphQL + Apollo', level: 'used', projects: ['ayamedica'] },
      { name: 'GCD / async-await', level: 'core', projects: ['marn-pos', 'riyadh-parking', 'ayamedica', 'emle'] },
    ],
  },
  {
    id: 'platform',
    label: 'Platform & Services',
    skills: [
      { name: 'POS hardware (print · scan)', level: 'strong', projects: ['marn-pos'] },
      { name: 'Firebase', level: 'strong', projects: ['marn-pos', 'ayamedica', 'swipy', 'ngchat', 'ton', 'ylaa-khair'] },
      { name: 'Push (APNs / FCM)', level: 'strong', projects: ['marn-pos', 'riyadh-parking', 'mawqfi', 'ayamedica', 'ngchat'] },
      { name: 'MapKit / Core Location', level: 'strong', projects: ['riyadh-parking', 'mawqfi', 'ton'] },
      { name: 'NFC / OCR (Vision)', level: 'used', projects: ['swipy'] },
      { name: 'Apple Pay · mada', level: 'used', projects: ['marn-pos'] },
      { name: 'CI/CD (Fastlane)', level: 'strong', projects: ['marn-pos', 'emle'] },
      { name: 'App Store delivery', level: 'core', projects: ['marn-pos', 'riyadh-parking', 'mawqfi', 'ayamedica', 'swipy', 'ton', 'moqawalat'] },
    ],
  },
];
