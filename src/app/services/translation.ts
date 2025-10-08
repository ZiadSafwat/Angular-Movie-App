import { Injectable, inject, signal, effect } from '@angular/core';
import { LanguageService } from './language';

export interface TranslationKeys {
  // Navigation
  home: string;
  movies: string;
  search: string;
  favorites: string;
  profile: string;
  
  // Authentication
  login: string;
  register: string;
  logout: string;
  
  // Common
  loading: string;
  error: string;
  noResults: string;
  tryAgain: string;
  
  // Movie Details
  overview: string;
  releaseDate: string;
  rating: string;
  runtime: string;
  genres: string;
  cast: string;
  
  // Search
  searchPlaceholder: string;
  searchResults: string;
  
  // Buttons
  viewDetails: string;
  addToFavorites: string;
  removeFromFavorites: string;
  watchTrailer: string;
  
  // Wishlist specific
  myWishlist: string;
  wishlistDescription: string;
  movie: string;
  moviesPlural: string;
  clearAll: string;
  wishlistEmpty: string;
  startAddingMovies: string;
  browseMovies: string;
  backToTop: string;
  clearWishlistConfirm: string;
  wishlistCleared: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations = signal<TranslationKeys>(this.getTranslations('en'));
  private languageService = inject(LanguageService);

  constructor() {
    // Initial load
    this.updateTranslations();
    
    // Update translations when language changes
    effect(() => {
      this.languageService.currentLanguage();
      this.updateTranslations();
    });
  }

  get t(): TranslationKeys {
    return this.translations();
  }

  updateTranslations(): void {
    const lang = this.languageService.currentLanguage();
    this.translations.set(this.getTranslations(lang));
  }

  private getTranslations(lang: string): TranslationKeys {
    // If languageService is not available yet, use the provided language
    
    const translations = {
      en: {
        // Navigation
        home: 'Home',
        movies: 'Movies',
        search: 'Search',
        favorites: 'Favorites',
        profile: 'Profile',
        
        // Authentication
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        
        // Common
        loading: 'Loading...',
        error: 'An error occurred',
        noResults: 'No results found',
        tryAgain: 'Try again',
        
        // Movie Details
        overview: 'Overview',
        releaseDate: 'Release Date',
        rating: 'Rating',
        runtime: 'Runtime',
        genres: 'Genres',
        cast: 'Cast',
        
        // Search
        searchPlaceholder: 'Search for movies...',
        searchResults: 'Search Results',
        
        // Buttons
        viewDetails: 'View Details',
        addToFavorites: 'Add to Favorites',
        removeFromFavorites: 'Remove from Favorites',
        watchTrailer: 'Watch Trailer',
        
        // Wishlist specific
        myWishlist: 'My Wishlist',
        wishlistDescription: 'Movies you\'ve added to your wishlist',
        movie: 'movie',
        moviesPlural: 'movies',
        clearAll: 'Clear All',
        wishlistEmpty: 'Your wishlist is empty',
        startAddingMovies: 'Start adding some movies to your wishlist!',
        browseMovies: 'Browse Movies',
        backToTop: 'Back to top',
        clearWishlistConfirm: 'Are you sure you want to clear all movies from your wishlist?',
        wishlistCleared: 'Wishlist cleared successfully'
      },
      ar: {
        // Navigation
        home: 'الرئيسية',
        movies: 'الأفلام',
        search: 'البحث',
        favorites: 'المفضلة',
        profile: 'الملف الشخصي',
        
        // Authentication
        login: 'تسجيل الدخول',
        register: 'إنشاء حساب',
        logout: 'تسجيل الخروج',
        
        // Common
        loading: 'جاري التحميل...',
        error: 'حدث خطأ',
        noResults: 'لم يتم العثور على نتائج',
        tryAgain: 'حاول مرة أخرى',
        
        // Movie Details
        overview: 'نظرة عامة',
        releaseDate: 'تاريخ الإصدار',
        rating: 'التقييم',
        runtime: 'مدة العرض',
        genres: 'الأنواع',
        cast: 'طاقم التمثيل',
        
        // Search
        searchPlaceholder: 'البحث عن الأفلام...',
        searchResults: 'نتائج البحث',
        
        // Buttons
        viewDetails: 'عرض التفاصيل',
        addToFavorites: 'إضافة للمفضلة',
        removeFromFavorites: 'إزالة من المفضلة',
        watchTrailer: 'مشاهدة المقطع الدعائي',
        
        // Wishlist specific
        myWishlist: 'قائمة المفضلة',
        wishlistDescription: 'الأفلام التي أضفتها إلى قائمة المفضلة',
        movie: 'فيلم',
        moviesPlural: 'أفلام',
        clearAll: 'مسح الكل',
        wishlistEmpty: 'قائمة المفضلة فارغة',
        startAddingMovies: 'ابدأ بإضافة بعض الأفلام إلى قائمة المفضلة!',
        browseMovies: 'تصفح الأفلام',
        backToTop: 'العودة إلى الأعلى',
        clearWishlistConfirm: 'هل أنت متأكد من مسح جميع الأفلام من المفضلة؟',
        wishlistCleared: 'تم مسح قائمة المفضلة'
      }
    };

    return translations[lang as keyof typeof translations] || translations.en;
  }
}
