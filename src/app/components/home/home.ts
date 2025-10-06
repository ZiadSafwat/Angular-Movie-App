import { Component } from '@angular/core';
import { MovieList } from '../../services/movie-list';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Movie } from '../../models/movie.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  movies: any[] = [];
  currentPage = 1;
  totalPages = 0;
  constructor(  
    public MovieService: MovieList,
    private router: Router,  
   )
   {
   
  }
   ngOnInit() {
    this.loadMovies(this.currentPage);
  }

  loadMovies(page: number) {
    this.MovieService.getMovies('now_playing',page).subscribe((data) => {
      this.movies = data.results;
      this.totalPages = data.total_pages;
      this.currentPage = data.page;
          window.scrollTo({ top: 0, behavior: 'smooth' });

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
}
