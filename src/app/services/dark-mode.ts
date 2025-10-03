// services/dark-mode.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private readonly DARK_MODE_KEY = 'dark_mode_enabled';
  
  isDarkMode = signal<boolean>(this.getInitialDarkMode());

  toggleDarkMode(): void {
    this.isDarkMode.update(mode => {
      const newMode = !mode;
      this.saveDarkModePreference(newMode);
      this.applyDarkMode(newMode);
      return newMode;
    });
  }

  setDarkMode(enabled: boolean): void {
    this.isDarkMode.set(enabled);
    this.saveDarkModePreference(enabled);
    this.applyDarkMode(enabled);
  }

  private getInitialDarkMode(): boolean {
    const saved = localStorage.getItem(this.DARK_MODE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private saveDarkModePreference(enabled: boolean): void {
    localStorage.setItem(this.DARK_MODE_KEY, JSON.stringify(enabled));
  }

  private applyDarkMode(enabled: boolean): void {
    if (enabled) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }
}