import { Component } from '@angular/core';
import { MovieList } from '../../services/movie-list';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  category: 'now_playing' | 'popular' | 'top_rated' | 'upcoming' = 'now_playing';

  constructor(
    public MovieService: MovieList,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    
    this.route.paramMap.subscribe(params => {
      const cat = params.get('category') as any;
      this.category = cat || 'now_playing';
      this.loadMovies(this.currentPage);
    });
  }

  loadMovies(page: number) {
    this.MovieService.getMovies(this.category, page).subscribe(data => {
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
