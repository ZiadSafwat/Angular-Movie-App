import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-movie-details',
    imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './movie-details.html',
   styleUrls: ['./movie-details.css'],
})
export class MovieDetails implements OnInit {
  movie: any;
  recommendations: any[] = [];
  apiKey = '542dd2bd8b7bec9ff41da1986ae577d1'; 

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('id');

    this.http.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${this.apiKey}`)
      .subscribe((data: any) => {
        this.movie = data;
      });

    this.http.get(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${this.apiKey}`)
      .subscribe((data: any) => {
        this.recommendations = data.results;
      });
  }

  getImageUrl(path: string) {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : 'assets/placeholder.jpg';
  }


  
}
