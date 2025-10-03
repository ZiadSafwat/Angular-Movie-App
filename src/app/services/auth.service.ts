// services/auth.service.ts
import { Injectable, signal } from '@angular/core';

export interface User {
  id: number;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'current_user';
  private readonly TOKEN_KEY = 'auth_token';
  
  currentUser = signal<User | null>(this.getStoredUser());
  isAuthenticated = signal<boolean>(!!this.getStoredUser());

  login(username: string, password: string): boolean {
    // Mock authentication - in real app, this would call an API
    if (username && password) {
      const user: User = {
        id: 1,
        username: username,
        email: `${username}@example.com`
      };
      
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      localStorage.setItem(this.TOKEN_KEY, 'mock-jwt-token');
      
      return true;
    }
    return false;
  }

  register(username: string, email: string, password: string): boolean {
    // Mock registration
    if (username && email && password) {
      const user: User = {
        id: Date.now(),
        username: username,
        email: email
      };
      
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      localStorage.setItem(this.TOKEN_KEY, 'mock-jwt-token');
      
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getCurrentUser(): string | null {
    return this.currentUser()?.username || null;
  }

  private getStoredUser(): User | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}