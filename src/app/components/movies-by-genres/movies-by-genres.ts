import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GenresService } from '../../services/genres-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movies-by-genres',
  imports: [CommonModule],
  templateUrl: './movies-by-genres.html',
  styleUrl: './movies-by-genres.css'
})
export class MoviesByGenres {
  movies: any[] = [];
  genreId!: number;
  genreName: string = '';
  currentPage = 1;
  totalPages = 0;

  constructor(
    private route: ActivatedRoute,
    private genresService: GenresService
  ) {}

  ngOnInit(): void {
    this.genreId = Number(this.route.snapshot.paramMap.get('id'));

    // Load genre name
    this.genresService.getGenres().subscribe((data: any) => {
      const genre = data.genres.find((g: any) => g.id === this.genreId);
      this.genreName = genre ? genre.name : 'Unknown Genre';
    });

    this.loadMovies(this.currentPage);
  }

  loadMovies(page: number) {
    this.genresService.getMoviesByGenre(this.genreId, page).subscribe((data: any) => {
      this.movies = data.results;
      this.currentPage = page;
      this.totalPages = data.total_pages; 
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
    if (page >= 1 && page <= this.totalPages) {
      this.loadMovies(page);
    }
  }
}
