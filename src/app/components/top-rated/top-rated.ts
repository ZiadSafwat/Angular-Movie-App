import { Component } from '@angular/core';
import { MovieList } from '../../services/movie-list';

@Component({
  selector: 'app-top-rated',
  imports: [],
  templateUrl: './top-rated.html',
  styleUrl: './top-rated.css',
})
export class TopRated {
  topRatedMovies: any[] = [];
  currentPage = 1;
  totalPages = 0;
  constructor(public MovieService: MovieList) {}
  ngOnInit() {
    this.loadMovies(this.currentPage);
  }

  loadMovies(page: number) {
    this.MovieService.getMovies('top_rated',page).subscribe((data) => {
      this.topRatedMovies = data.results;
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
