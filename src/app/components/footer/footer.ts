import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from 'src/app/services/language';
 
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer implements OnInit {
  private languageService = inject(LanguageService);
  
  translations: any = {};
  currentYear = new Date().getFullYear();

  async ngOnInit() {
    await this.loadTranslations();
  }

  private async loadTranslations() {
    try {
      const res = await fetch('assets/i18n/navbar-translations.json');
      this.translations = await res.json();
    } catch (error) {
      console.error('Failed to load footer translations:', error);
      this.translations = {
        en: {},
        ar: {}
      };
    }
  }

  t(key: string): string {
    const lang = this.languageService.currentLanguage();
    return this.translations?.[lang]?.[key] ?? key;
  }
}