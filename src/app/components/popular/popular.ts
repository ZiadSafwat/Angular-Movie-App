import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MovieList } from '../../services/movie-list';

@Component({
  selector: 'app-popular',
  imports: [CommonModule],
  templateUrl: './popular.html',
  styleUrl: './popular.css'
})
export class Popular {
 popularMovies: any[] = [];
  currentPage = 1;
  totalPages = 0;
  constructor(  
    public MovieService: MovieList,
   
   )
   {
   
  }
   ngOnInit() {
    this.loadMovies(this.currentPage);
  }

  loadMovies(page: number) {
    this.MovieService.getMovies('popular',page).subscribe((data) => {
      this.popularMovies = data.results;
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
}
