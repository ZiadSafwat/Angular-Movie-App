// services/language.service.ts
import { Injectable, signal, effect } from '@angular/core';

export type Language = 'en' | 'ar';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANGUAGE_KEY = 'app_language';

  currentLanguage = signal<Language>(this.getInitialLanguage());
  isRTL = signal<boolean>(this.currentLanguage() === 'ar');

  readonly languages = [
    { code: 'en', name: 'English', dir: 'ltr' },
    { code: 'ar', name: 'العربية', dir: 'rtl' }
  ];

  constructor() {
    // 🧠 Automatically apply language settings on service load
    this.applyLanguage(this.currentLanguage());

    // Optional: If you want to reactively apply without reload
    effect(() => {
      const lang = this.currentLanguage();
      this.isRTL.set(lang === 'ar');
      this.saveLanguagePreference(lang);
      this.applyLanguage(lang);
    });
  }

  setLanguage(lang: Language): void {
    if (this.currentLanguage() === lang) return; // 🛑 Avoid redundant operations
    this.currentLanguage.set(lang);
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage() === 'en' ? 'ar' : 'en';
    this.setLanguage(newLang);
  }

  private getInitialLanguage(): Language {
    const saved = localStorage.getItem(this.LANGUAGE_KEY) as Language;
    return saved || 'en';
  }

  private saveLanguagePreference(lang: Language): void {
    localStorage.setItem(this.LANGUAGE_KEY, lang);
  }

  private applyLanguage(lang: Language): void {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.documentElement.dir = dir;
    document.documentElement.lang = lang;

    // Toggle body classes for RTL/LTR styling
    document.body.classList.toggle('rtl', lang === 'ar');
    document.body.classList.toggle('ltr', lang !== 'ar');
  }
}
 