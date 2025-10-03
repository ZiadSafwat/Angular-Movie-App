// pages/wishlist/wishlist.component.ts
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieCardComponent } from '../../components/movie-card/movie-card';
import { WishlistService } from '../../services/wishlist';
import { NotificationService } from '../../services/notification';
import { LanguageService } from '../../services/language';
import { DarkModeService } from '../../services/dark-mode';
import { TranslationService } from '../../services/translation';


@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, MovieCardComponent],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css']
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlistService = inject(WishlistService);
  notificationService = inject(NotificationService);
  languageService = inject(LanguageService);
  darkModeService = inject(DarkModeService);
  translationService = inject(TranslationService);

  showBackToTop = signal(false);
  private scrollListener!: () => void;

  ngOnInit(): void {
    this.setupScrollListener();
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  clearWishlist(): void {
    if (confirm(this.translationService.t.clearWishlistConfirm)) {
      this.wishlistService.clearWishlist();
      this.notificationService.show(
        this.translationService.t.wishlistCleared,
        'success'
      );
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private setupScrollListener(): void {
    this.scrollListener = () => {
      this.showBackToTop.set(window.scrollY > 300);
    };
    window.addEventListener('scroll', this.scrollListener);
  }
}