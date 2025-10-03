// components/movie-card/movie-card.component.ts
import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../services/wishlist';
import { MovieService } from '../../services/movie';
import { LanguageService } from '../../services/language';
import { DarkModeService } from '../../services/dark-mode';
import { NotificationService } from '../../services/notification';
import { TranslationService } from '../../services/translation';
import { Movie } from '../../models/movie.model';
 
@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.css']
})
export class MovieCardComponent {
  movie = input.required<Movie>();
  showRemove = input<boolean>(false);

  wishlistService = inject(WishlistService);
  movieService = inject(MovieService);
  darkModeService = inject(DarkModeService);
  languageService = inject(LanguageService);
  translationService = inject(TranslationService);
  notificationService = inject(NotificationService);

  getImageUrl(): string {
    return this.movieService.getImageUrl(this.movie().poster_path);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/default-movie-poster.jpg';
  }

  isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.movie().id);
  }

  toggleWishlist(): void {
    this.wishlistService.toggleWishlist(this.movie());
  }

  removeFromWishlist(): void {
    this.wishlistService.removeFromWishlist(this.movie().id);
  }

  truncateOverview(): string {
    const overview = this.movie().overview;
    const maxLength = 120;
    
    if (overview.length <= maxLength) {
      return overview;
    }
    
    return overview.substring(0, maxLength) + '...';
  }
}