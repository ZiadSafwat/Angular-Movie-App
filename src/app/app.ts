import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { DarkModeService } from './services/dark-mode';
import { Observable } from 'rxjs';
import { LoadingService } from './services/loading-service';
import { LoadingSpinner } from './components/loading-spinner/loading-spinner';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, Footer,LoadingSpinner,AsyncPipe],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected readonly title = signal('Movie-App');
  private darkModeService = inject(DarkModeService);
  isLoading: Observable<boolean>;


   constructor(private loadingService: LoadingService) {
    this.isLoading = this.loadingService.isLoading$;
    
  }
  ngOnInit(): void {
    // Initialize dark mode on app startup
    this.darkModeService.setDarkMode(this.darkModeService.isDarkMode());
    
  
  }
}
