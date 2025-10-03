// services/language.service.ts
import { Injectable, signal } from '@angular/core';

export type Language = 'en' | 'ar' | 'fr' | 'zh';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANGUAGE_KEY = 'app_language';
  
  currentLanguage = signal<Language>(this.getInitialLanguage());
  isRTL = signal<boolean>(this.currentLanguage() === 'ar');

  readonly languages = [
    { code: 'en', name: 'English', dir: 'ltr' },
    { code: 'ar', name: 'العربية', dir: 'rtl' },
    { code: 'fr', name: 'Français', dir: 'ltr' },
    { code: 'zh', name: '中文', dir: 'ltr' }
  ];

  setLanguage(lang: Language): void {
    this.currentLanguage.set(lang);
    this.isRTL.set(lang === 'ar');
    this.saveLanguagePreference(lang);
    this.applyLanguage(lang);
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
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // إعادة تحميل الصفحة لتطبيق اللغة على جميع البيانات
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
}