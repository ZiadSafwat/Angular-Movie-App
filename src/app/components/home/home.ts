import { Component, inject } from '@angular/core';
import { MovieList } from '../../services/movie-list';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../services/wishlist';
import { LanguageService } from 'src/app/services/language';
import { LoadingService } from 'src/app/services/loading-service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  movies: any[] = [];
  currentPage = 1;
  totalPages = 0;
  wishlistService = inject(WishlistService);
  languageService = inject(LanguageService);
  
  category: 'now_playing' | 'popular' | 'top_rated' | 'upcoming' = 'now_playing';
  translations: any = {};
  constructor(    
    public MovieService: MovieList,
    private router: Router,   
     private route: ActivatedRoute,
     private loadingService: LoadingService 
  
  ) {}
  
  ngOnInit() {
    
    this.route.paramMap.subscribe(params => {
      const cat = params.get('category') as any;
      this.category = cat || 'now_playing';
      this.loadMovies(this.currentPage);
      
    });
    this.loadTranslations();
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
  loadMovies(page: number) {
     this.loadingService.show();
    this.MovieService.getMovies(this.category, page).subscribe((data) => {
      this.movies = data.results;
      this.totalPages = data.total_pages;
      this.currentPage = data.page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.loadingService.hide();
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadMovies(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.loadMovies(this.currentPage - 1);
    }
  }

  goToPage(page: number) {
    this.loadMovies(page);
  }

  goToDetails(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }

  toggleWishlist(movie: any, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    
    // Add a small delay to ensure the event is fully stopped
    setTimeout(() => {
      this.wishlistService.toggleWishlist(movie);
    }, 0);
  }

  isInWishlist(movieId: number): boolean {
    return this.wishlistService.isInWishlist(movieId);
  }
  t(key: string): string {
    // Use the current language from LanguageService
    const lang = this.languageService.currentLanguage();
    return this.translations?.[lang]?.[key] ?? key;
  }
}