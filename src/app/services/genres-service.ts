import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenresService {
  private apiKey = '61665dea1d8f56d9fb803fa5681450bf';
  private baseUrl = 'https://api.themoviedb.org/3';
 
  constructor(private http: HttpClient) {}

  // Get all genres
  getGenres(): Observable<any> {
    const params = new HttpParams().set('api_key', this.apiKey);
    return this.http.get(`${this.baseUrl}/genre/movie/list`, { params });
  }

  // Get movies by genre id
  getMoviesByGenre(genreId: number, page: number = 1,sortBy: string = 'popularity.desc'): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('with_genres', genreId.toString())
      .set('page', page.toString())
      .set('sort_by', sortBy);
    return this.http.get(`${this.baseUrl}/discover/movie`, { params });
  }

}
