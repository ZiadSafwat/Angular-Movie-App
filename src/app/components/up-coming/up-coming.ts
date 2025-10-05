import { Component } from '@angular/core';
import { MovieList } from '../../services/movie-list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-up-coming',
  imports: [CommonModule],
  templateUrl: './up-coming.html',
  styleUrl: './up-coming.css',
})
export class UpComing {
  upComingMovies: any[] = [];
  currentPage = 1;
  totalPages = 0;
  constructor(public MovieService: MovieList) {}
  ngOnInit() {
    this.loadMovies(this.currentPage);
  }

  loadMovies(page: number) {
    this.MovieService.getMovies('upcoming', page).subscribe((data) => {
      this.upComingMovies = data.results;
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
