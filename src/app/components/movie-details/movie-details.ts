import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserModule, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { LoadingService } from 'src/app/services/loading-service';


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
  trailerUrl: SafeResourceUrl | null = null; 
  apiKey = '542dd2bd8b7bec9ff41da1986ae577d1'; 

  constructor(
    private route: ActivatedRoute,
     private http: HttpClient, 
     private sanitizer: DomSanitizer,
     private loadingService: LoadingService   ) {}

  ngOnInit(): void {
      this.loadingService.show();
    const movieId = this.route.snapshot.paramMap.get('id');

    this.http.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${this.apiKey}`)
      .subscribe((data: any) => {
        this.movie = data;

      });

    this.http.get(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${this.apiKey}`)
      .subscribe((data: any) => {
        this.recommendations = data.results;

        
      });
    this.http.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${this.apiKey}`)
      .subscribe((data: any) => {
        const trailer = data.results.find(
          (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
        );
        if (trailer) {
          const url = `https://www.youtube.com/embed/${trailer.key}`;
          this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }
         this.loadingService.hide();
    
      });

  }
  getImageUrl(path: string) {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : 'assets/placeholder.jpg';
  }
}
