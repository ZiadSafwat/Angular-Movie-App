// services/wishlist.service.ts
import { Injectable, signal, inject } from '@angular/core';
import { Movie } from '../models/movie.model';
import { NotificationService } from './notification';
import { LanguageService } from './language';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private notificationService = inject(NotificationService);
  private languageService = inject(LanguageService);
  
  private readonly WISHLIST_KEY = 'movie_wishlist';
  
  wishlistItems = signal<Movie[]>(this.getWishlistFromStorage());
  wishlistCount = signal<number>(this.wishlistItems().length);

  addToWishlist(movie: Movie): void {
    const currentWishlist = this.wishlistItems();
    if (!this.isInWishlist(movie.id)) {
      const updatedWishlist = [...currentWishlist, movie];
      this.updateWishlist(updatedWishlist);
      
      // Show notification
      const message = this.languageService.currentLanguage() === 'ar' 
        ? 'تمت الإضافة إلى المفضلة' 
        : 'Added to wishlist';
      this.notificationService.show(message, 'success');
    }
  }

  removeFromWishlist(movieId: number): void {
    const updatedWishlist = this.wishlistItems().filter(movie => movie.id !== movieId);
    this.updateWishlist(updatedWishlist);
    
    // Show notification
    const message = this.languageService.currentLanguage() === 'ar' 
      ? 'تمت الإزالة من المفضلة' 
      : 'Removed from wishlist';
    this.notificationService.show(message, 'info');
  }

  toggleWishlist(movie: Movie): void {
    if (this.isInWishlist(movie.id)) {
      this.removeFromWishlist(movie.id);
    } else {
      this.addToWishlist(movie);
    }
  }

  isInWishlist(movieId: number): boolean {
    return this.wishlistItems().some(movie => movie.id === movieId);
  }

  clearWishlist(): void {
    this.updateWishlist([]);
  }

  private updateWishlist(wishlist: Movie[]): void {
    this.wishlistItems.set(wishlist);
    this.wishlistCount.set(wishlist.length);
    localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(wishlist));
  }
  getWishlist(): Movie[] {
    return this.wishlistItems();
  }
  private getWishlistFromStorage(): Movie[] {
    const stored = localStorage.getItem(this.WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}