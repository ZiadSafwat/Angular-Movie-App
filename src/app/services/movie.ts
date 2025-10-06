// services/movie.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Genre, Movie, MovieResponse } from '../models/movie.model';
import { LanguageService } from './language';
 
@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);
  private languageService = inject(LanguageService);
  
  private readonly API_KEY = '542dd2bd8b7bec9ff41da1986ae577d1';
  private readonly BASE_URL = 'https://api.themoviedb.org/3';
  private readonly IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

  getNowPlaying(page: number = 1): Observable<MovieResponse> {
    const params = new HttpParams()
      .set('api_key', this.API_KEY)
      .set('page', page.toString())
      .set('language', this.languageService.currentLanguage());

    return this.http.get<MovieResponse>(`${this.BASE_URL}/movie/now_playing`, { params });
  }

  getMovieDetails(id: number): Observable<Movie> {
    const params = new HttpParams()
      .set('api_key', this.API_KEY)
      .set('language', this.languageService.currentLanguage());

    return this.http.get<Movie>(`${this.BASE_URL}/movie/${id}`, { params });
  }

  getRecommendedMovies(movieId: number): Observable<MovieResponse> {
    const params = new HttpParams()
      .set('api_key', this.API_KEY)
      .set('language', this.languageService.currentLanguage());

    return this.http.get<MovieResponse>(`${this.BASE_URL}/movie/${movieId}/recommendations`, { params });
  }

  searchMovies(query: string, page: number = 1): Observable<MovieResponse> {
    const params = new HttpParams()
      .set('api_key', this.API_KEY)
      .set('query', query)
      .set('page', page.toString())
      .set('language', this.languageService.currentLanguage());

    return this.http.get<MovieResponse>(`${this.BASE_URL}/search/movie`, { params });
  }

  getGenres(): Observable<{ genres: Genre[] }> {
    const params = new HttpParams()
      .set('api_key', this.API_KEY)
      .set('language', this.languageService.currentLanguage());

    return this.http.get<{ genres: Genre[] }>(`${this.BASE_URL}/genre/movie/list`, { params });
  }

  getMovieTrailer(movieId: number): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.API_KEY);

    return this.http.get(`${this.BASE_URL}/movie/${movieId}/videos`, { params });
  }

  getImageUrl(path: string, size: string = 'w500'): string {
    return `${this.IMAGE_BASE_URL}/${size}${path}`;
  }
}