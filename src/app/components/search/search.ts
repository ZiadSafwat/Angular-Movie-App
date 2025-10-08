import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie';
import { Movie } from '../../models/movie.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class Search implements OnInit {
  results: Movie[] = [];
  query = '';
  currentPage = 1;
  totalPages = 1;
  isLoading = false;

  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  private router = inject(Router);
  private wishlistService = inject(WishlistService);

  // Translation keys - you can move this to a separate translation service
  translations = {
    en: {
      searchResults: 'Search results for',
      noResults: 'No results found.',
      release: 'Release',
      page: 'Page',
      of: 'of',
      first: 'First',
      prev: 'Prev',
      next: 'Next',
      last: 'Last'
    },
    ar: {
      searchResults: 'نتائج البحث عن',
      noResults: 'لم يتم العثور على نتائج.',
      release: 'الإصدار',
      page: 'صفحة',
      of: 'من',
      first: 'الأولى',
      prev: 'السابق',
      next: 'التالى',
      last: 'الأخيرة'
    }
  };

  currentLang = 'en';

  ngOnInit(): void {
    // Load language from localStorage or default to 'en'
    this.currentLang = localStorage.getItem('navbar_lang') || 'en';
    
    this.route.params.subscribe(params => {
      this.query = params['query'];
      this.currentPage = 1;  
      this.searchMovies();
    });
  }

  searchMovies(): void {
    this.isLoading = true;
    this.movieService.searchMovies(this.query, this.currentPage).subscribe({
      next: (res) => {
        this.results = res.results;
        this.totalPages = res.total_pages;
        this.currentPage = res.page;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.isLoading = false;
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.searchMovies();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getImageUrl(path: string): string {
    return this.movieService.getImageUrl(path);
  }

  goToDetails(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }

  toggleWishlist(movie: Movie, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    
    setTimeout(() => {
      this.wishlistService.toggleWishlist(movie);
    }, 0);
  }

  isInWishlist(movieId: number): boolean {
    return this.wishlistService.isInWishlist(movieId);
  }

  // Translation method
  t(key: string): string {
    return this.translations[this.currentLang as keyof typeof this.translations]?.[key as keyof typeof this.translations['en']] || key;
  }

  // Pagination methods
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }
}