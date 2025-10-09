import { Component, inject, signal, OnInit, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { WishlistService } from '../../services/wishlist';
import { DarkModeService } from '../../services/dark-mode';
import { LanguageService } from '../../services/language';
import { AuthService } from '../../services/auth.service';
import { DarkModeToggleComponent } from '../dark-mode-toggle/dark-mode-toggle';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, DarkModeToggleComponent],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  wishlistService = inject(WishlistService);
  darkModeService = inject(DarkModeService);
  languageService = inject(LanguageService);
  authService = inject(AuthService);
  router = inject(Router);

  translations: any = {};
  isMobileMenuOpen = signal<boolean>(false);
  isUserDropdownOpen = signal<boolean>(false);
  
  // Use computed to reactively get auth state
  isLoggedIn = computed(() => this.authService.isAuthenticated());
  currentUser = computed(() => 
    this.isLoggedIn() ? (this.authService.getCurrentUser() || 'User') : ''
  );

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Close dropdown if clicked outside
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown')) {
      this.isUserDropdownOpen.set(false);
    }
  }

  async ngOnInit() {
    // Load translations JSON
    await this.loadTranslations();
  }

  private async loadTranslations() {
    try {
      const res = await fetch('assets/i18n/navbar-translations.json');
      this.translations = await res.json();
    } catch (error) {
      console.error('Failed to load translations:', error);
      this.translations = {
        en: {},
        ar: {}
      };
    }
  }

  changeLanguage(event: Event) {
    const lang = (event.target as HTMLSelectElement).value as 'en' | 'ar';
    
    // Get current route to reload the same page
    const currentRoute = this.router.url;
    
    // Use the LanguageService to change language
    this.languageService.setLanguage(lang);
    
    // Force reload of current page to refresh data
    setTimeout(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentRoute]);
      });
    }, 100);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(open => !open);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen.update(open => !open);
  }

  closeUserDropdown() {
    this.isUserDropdownOpen.set(false);
  }

  t(key: string): string {
    // Use the current language from LanguageService
    const lang = this.languageService.currentLanguage();
    return this.translations?.[lang]?.[key] ?? key;
  }

  onSearch(query: string, event?: Event) {
    if (event) event.preventDefault();
    if (query && query.trim().length > 0) {
      this.router.navigate(['/search', query.trim()]);
      this.closeMobileMenu();
      this.closeUserDropdown();
    }
  }

  logout(): void {
    this.authService.logout();
    this.closeMobileMenu();
    this.closeUserDropdown();
    this.router.navigate(['/']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
    this.closeMobileMenu();
    this.closeUserDropdown();
  }
}