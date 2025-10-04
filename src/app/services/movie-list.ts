import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieList {
   constructor(private http: HttpClient) { }
  private apiKey = '61665dea1d8f56d9fb803fa5681450bf';

private baseUrl = 'https://api.themoviedb.org/3/movie';


getMovies(category: 'now_playing' | 'popular' | 'top_rated' | 'upcoming', page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/${category}?api_key=${this.apiKey}&page=${page}`);
  }



}
