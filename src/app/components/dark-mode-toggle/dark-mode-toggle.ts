// components/dark-mode-toggle/dark-mode-toggle.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkModeService } from '../../services/dark-mode';
import { LanguageService } from '../../services/language';
 

@Component({
  selector: 'app-dark-mode-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dark-mode-toggle.html',
  styles: [`
    .dark-mode-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 8px;
      transition: background-color 0.3s ease;
    }
    .dark-mode-toggle:hover {
      background-color: var(--hover-bg);
    }
    .toggle-container {
      position: relative;
      width: 60px;
      height: 30px;
      background: linear-gradient(145deg, #667eea, #764ba2);
      border-radius: 15px;
      display: flex;
      align-items: center;
      padding: 0 5px;
      transition: all 0.3s ease;
    }
    .toggle-container.dark {
      background: linear-gradient(145deg, #4facfe, #00f2fe);
    }
    .sun-icon, .moon-icon {
      font-size: 14px;
      transition: opacity 0.3s ease;
      z-index: 1;
    }
    .sun-icon {
      opacity: 1;
    }
    .moon-icon {
      opacity: 0;
    }
    .toggle-container.dark .sun-icon {
      opacity: 0;
    }
    .toggle-container.dark .moon-icon {
      opacity: 1;
    }
    .toggle-thumb {
      position: absolute;
      left: 3px;
      width: 24px;
      height: 24px;
      background: white;
      border-radius: 50%;
      transition: transform 0.3s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .toggle-container.dark .toggle-thumb {
      transform: translateX(30px);
    }
    .toggle-text {
      font-size: 0.9rem;
      color: var(--text-color);
      font-weight: 500;
    }
  `]
})
export class DarkModeToggleComponent {
  darkModeService = inject(DarkModeService);
  languageService = inject(LanguageService);
  
  isDarkMode = this.darkModeService.isDarkMode;

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }
}
