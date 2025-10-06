import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie';
import { Movie } from '../../models/movie.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class Search implements OnInit {
  results: Movie[] = [];
  query = '';
  currentPage = 1;
  totalPages = 1;

  constructor(private route: ActivatedRoute, private movieService: MovieService,   private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.query = params['query'];
      this.currentPage = 1;  
      this.searchMovies();
    });
  }

  searchMovies(): void {
    this.movieService.searchMovies(this.query, this.currentPage).subscribe(res => {
      this.results = res.results;
      this.totalPages = res.total_pages;
      this.currentPage = res.page;
    }, error => {
      console.error('Search error:', error);
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.searchMovies();
    }
  }

  getImageUrl(path: string): string {
    return this.movieService.getImageUrl(path);
  }


  goToDetails(movieId: number) {
  this.router.navigate(['/movie', movieId]);
}
}
