import { Component } from '@angular/core';
import { MovieService } from '../../services/movie';
import { GenresService } from '../../services/genres-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-genres',
  imports: [],
  templateUrl: './genres.html',
  styleUrl: './genres.css'
})
export class Genres {
genres: any[] = [];

  constructor(private GenresService: GenresService, private router: Router) {}

  ngOnInit(): void {
    this.GenresService.getGenres().subscribe((data: any) => {
      this.genres = data.genres;
    });
  }

  onGenreClick(genreId: number) {
    this.router.navigate(['/genre', genreId]);
  }
}
