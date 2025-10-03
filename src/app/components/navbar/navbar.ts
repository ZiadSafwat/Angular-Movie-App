// components/navbar/navbar.component.ts
import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../services/wishlist';
import { DarkModeService } from '../../services/dark-mode';
import { LanguageService } from '../../services/language';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation';
import { DarkModeToggleComponent } from '../dark-mode-toggle/dark-mode-toggle';
 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, DarkModeToggleComponent],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  wishlistService = inject(WishlistService);
  darkModeService = inject(DarkModeService);
  languageService = inject(LanguageService);
  translationService = inject(TranslationService);
  authService = inject(AuthService);

  isMobileMenuOpen = signal(false);
  showUserMenu = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.showUserMenu.set(false);
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getCurrentUser(): string {
    return this.authService.getCurrentUser() || 'User';
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(open => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  toggleUserMenu(): void {
    this.showUserMenu.update(show => !show);
  }

  onLanguageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.languageService.setLanguage(select.value as any);
    // Update translations after language change
    this.translationService.updateTranslations();
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu.set(false);
    // Optional: Redirect to home page
    // this.router.navigate(['/']);
  }

  getTranslation(key: string): string {
    // Map old keys to new translation keys
    const keyMap: { [key: string]: string } = {
      'Movies': 'movies',
      'Wishlist': 'favorites',
      'Search': 'search',
      'Login': 'login',
      'Register': 'register',
      'Account': 'profile',
      'Logout': 'logout'
    };

    const translationKey = keyMap[key];
    if (translationKey && translationKey in this.translationService.t) {
      return this.translationService.t[translationKey as keyof typeof this.translationService.t];
    }
    
    return key;
  }
}