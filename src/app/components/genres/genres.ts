import { Component } from '@angular/core';
import { MovieService } from '../../services/movie';
import { GenresService } from '../../services/genres-service';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading-service';

@Component({
  selector: 'app-genres',
  imports: [],
  templateUrl: './genres.html',
  styleUrl: './genres.css'
})
export class Genres {
genres: any[] = [];

  constructor(private GenresService: GenresService, private router: Router,private loadingService: LoadingService ) {}

  ngOnInit(): void {
     this.loadingService.show();
    this.GenresService.getGenres().subscribe((data: any) => {
      this.genres = data.genres;
      this.loadingService.hide();
    });
  }

  onGenreClick(genreId: number) {
    
    this.router.navigate(['/genre', genreId]);
  }
}
