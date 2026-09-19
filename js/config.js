/**
 * TECHPATH — Global Configuration & System Constants
 * Precision Telemetry Architecture
 */

import { DEPARTMENTS, ALL_BRANCHES } from './services/TaxonomyEngine.js';

export const CONFIG = {
  version: '3.0.0',
  appName: 'TechPath',
  tagline: 'Authentic Curriculum Learning for Engineers',
  
  api: {
    baseUrl: 'http://localhost:8080/api'
  },

  // Single Supabase Client Configuration
  supabase: {
    url: 'https://hcvgndaetfarwsbjxcog.supabase.co',
    anonKey: window.localStorage.getItem('TECHPATH_SUPABASE_ANON_KEY') || '',
    isConfigured() {
      return Boolean(this.url && this.anonKey && !this.anonKey.includes('mock') && !this.anonKey.includes('<NEW_ROTATED'));
    }
  },

  // Canonical Engineering Department & Branch Identifiers
  departments: [
    { id: 'eng', name: 'Faculty of Engineering & Technology', code: 'ENG' },
    ...DEPARTMENTS.map(d => ({ id: d.id, name: d.name, code: d.code }))
  ],

  branches: [
    ...ALL_BRANCHES.map(b => ({ id: b.id, name: b.name, code: b.code, icon: 'cpu', semesters: 8 }))
  ],

  semesters: [
    { id: 'sem_1', number: 1, name: 'Semester 1', year: 1 },
    { id: 'sem_2', number: 2, name: 'Semester 2', year: 1 },
    { id: 'sem_3', number: 3, name: 'Semester 3', year: 2 },
    { id: 'sem_4', number: 4, name: 'Semester 4', year: 2 },
    { id: 'sem_5', number: 5, name: 'Semester 5', year: 3 },
    { id: 'sem_6', number: 6, name: 'Semester 6', year: 3 },
    { id: 'sem_7', number: 7, name: 'Semester 7', year: 4 },
    { id: 'sem_8', number: 8, name: 'Semester 8', year: 4 }
  ],

  // 50+ Languages Supported with RTL indicators
  languages: [
    { code: 'en', name: 'English', rtl: false },
    { code: 'te', name: 'తెలుగు (Telugu)', rtl: false },
    { code: 'hi', name: 'हिन्दी (Hindi)', rtl: false },
    { code: 'ta', name: 'தமிழ் (Tamil)', rtl: false },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', rtl: false },
    { code: 'ml', name: 'മലയാളം (Malayalam)', rtl: false },
    { code: 'mr', name: 'मराठी (Marathi)', rtl: false },
    { code: 'bn', name: 'বাংলা (Bengali)', rtl: false },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)', rtl: false },
    { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)', rtl: false },
    { code: 'ur', name: 'اردو (Urdu)', rtl: true },
    { code: 'or', name: 'ଓଡ଼ିଆ (Odia)', rtl: false },
    { code: 'as', name: 'অসমীয়া (Assamese)', rtl: false },
    { code: 'ne', name: 'नेपाली (Nepali)', rtl: false },
    { code: 'si', name: 'සිංහල (Sinhala)', rtl: false },
    { code: 'es', name: 'Español (Spanish)', rtl: false },
    { code: 'fr', name: 'Français (French)', rtl: false },
    { code: 'de', name: 'Deutsch (German)', rtl: false },
    { code: 'it', name: 'Italiano (Italian)', rtl: false },
    { code: 'pt', name: 'Português (Portuguese)', rtl: false },
    { code: 'pt-BR', name: 'Português (Brasil)', rtl: false },
    { code: 'nl', name: 'Nederlands (Dutch)', rtl: false },
    { code: 'ru', name: 'Русский (Russian)', rtl: false },
    { code: 'uk', name: 'Українська (Ukrainian)', rtl: false },
    { code: 'pl', name: 'Polski (Polish)', rtl: false },
    { code: 'cs', name: 'Čeština (Czech)', rtl: false },
    { code: 'sk', name: 'Slovenčina (Slovak)', rtl: false },
    { code: 'hu', name: 'Magyar (Hungarian)', rtl: false },
    { code: 'ro', name: 'Română (Romanian)', rtl: false },
    { code: 'bg', name: 'Български (Bulgarian)', rtl: false },
    { code: 'el', name: 'Ελληνικά (Greek)', rtl: false },
    { code: 'sr', name: 'Српски (Serbian)', rtl: false },
    { code: 'hr', name: 'Hrvatski (Croatian)', rtl: false },
    { code: 'sl', name: 'Slovenščina (Slovenian)', rtl: false },
    { code: 'lt', name: 'Lietuvių (Lithuanian)', rtl: false },
    { code: 'lv', name: 'Latviešu (Latvian)', rtl: false },
    { code: 'et', name: 'Eesti (Estonian)', rtl: false },
    { code: 'ar', name: 'العربية (Arabic)', rtl: true },
    { code: 'he', name: 'עברית (Hebrew)', rtl: true },
    { code: 'fa', name: 'فارسی (Persian)', rtl: true },
    { code: 'tr', name: 'Türkçe (Turkish)', rtl: false },
    { code: 'zh', name: '简体中文 (Simplified Chinese)', rtl: false },
    { code: 'zh-TW', name: '繁體中文 (Traditional Chinese)', rtl: false },
    { code: 'ja', name: '日本語 (Japanese)', rtl: false },
    { code: 'ko', name: '한국어 (Korean)', rtl: false },
    { code: 'th', name: 'ไทย (Thai)', rtl: false },
    { code: 'vi', name: 'Tiếng Việt (Vietnamese)', rtl: false },
    { code: 'id', name: 'Bahasa Indonesia (Indonesian)', rtl: false },
    { code: 'ms', name: 'Bahasa Melayu (Malay)', rtl: false },
    { code: 'fil', name: 'Filipino (Tagalog)', rtl: false },
    { code: 'sw', name: 'Kiswahili (Swahili)', rtl: false }
  ],

  // Precision Telemetry Brand Tokens
  theme: {
    primaryCrimson: '#e11d48',
    laserRed: '#ff4d5a',
    deepObsidian: '#0b0d12',
    cosmicSlate: '#111827',
    substrateIce: '#f9f9ff',
    borderHairline: 'rgba(226, 232, 240, 0.8)',
    borderDark: 'rgba(255, 255, 255, 0.08)'
  }
};

export const APP_CONFIG = CONFIG;

