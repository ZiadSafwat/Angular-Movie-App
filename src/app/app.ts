import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { DarkModeService } from './services/dark-mode';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected readonly title = signal('Movie-App');
  private darkModeService = inject(DarkModeService);

  ngOnInit(): void {
    // Initialize dark mode on app startup
    this.darkModeService.setDarkMode(this.darkModeService.isDarkMode());
  }
}
