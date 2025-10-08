import { Injectable, signal } from '@angular/core';

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string; // optional - only stored locally for mock
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'users';
  private readonly CURRENT_USER_KEY = 'current_user';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly LOGIN_FLAG_KEY = 'isLoggedIn';

  currentUser = signal<User | null>(this.getStoredCurrentUser());
  isAuthenticated = signal<boolean>(!!this.getStoredCurrentUser());

  constructor() {}

  /** ✅ Register a new user (stored in localStorage for mock) */
  register(username: string, email: string, password: string): boolean {
    if (!username || !email || !password) return false;

    const users = this.getStoredUsers();
    if (users.some(u => u.email === email)) {
      alert('❌ Email already registered!');
      return false;
    }

    const newUser: User = {
      id: Date.now(),
      username,
      email,
      password // only for mock
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

    // Auto-login after register
    this.setSession(newUser);
    return true;
  }

  /** ✅ Login using stored mock users */
  login(email: string, password: string): boolean {
    const users = this.getStoredUsers();
    const foundUser = users.find(u => u.email === email);

    if (foundUser && foundUser.password === password) {
      this.setSession(foundUser);
      return true;
    }

    return false;
  }

  /** ✅ Clear session and local storage flags */
  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);

    localStorage.removeItem(this.CURRENT_USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.setItem(this.LOGIN_FLAG_KEY, 'false');
  }

  /** ✅ Return true if logged in */
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  /** ✅ Get username of current user */
  getCurrentUser(): string | null {
    return this.currentUser()?.username || null;
  }

  /** 🧠 Private helpers */

  private setSession(user: User): void {
    this.currentUser.set(user);
    this.isAuthenticated.set(true);

    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_KEY, 'mock-jwt-token');
    localStorage.setItem(this.LOGIN_FLAG_KEY, 'true');
  }

  private getStoredUsers(): User[] {
    const data = localStorage.getItem(this.USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private getStoredCurrentUser(): User | null {
    const data = localStorage.getItem(this.CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }
}



// // services/auth.service.ts
// import { Injectable, signal } from '@angular/core';

// export interface User {
//   id: number;
//   username: string;
//   email: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private readonly USER_KEY = 'current_user';
//   private readonly TOKEN_KEY = 'auth_token';
  
//   currentUser = signal<User | null>(this.getStoredUser());
//   isAuthenticated = signal<boolean>(!!this.getStoredUser());

//   login(username: string, password: string): boolean {
//     // Mock authentication - in real app, this would call an API
//     if (username && password) {
//       const user: User = {
//         id: 1,
//         username: username,
//         email: `${username}@example.com`
//       };
      
//       this.currentUser.set(user);
//       this.isAuthenticated.set(true);
      
//       localStorage.setItem(this.USER_KEY, JSON.stringify(user));
//       localStorage.setItem(this.TOKEN_KEY, 'mock-jwt-token');
      
//       return true;
//     }
//     return false;
//   }

//   register(username: string, email: string, password: string): boolean {
//     // Mock registration
//     if (username && email && password) {
//       const user: User = {
//         id: Date.now(),
//         username: username,
//         email: email
//       };
      
//       this.currentUser.set(user);
//       this.isAuthenticated.set(true);
      
//       localStorage.setItem(this.USER_KEY, JSON.stringify(user));
//       localStorage.setItem(this.TOKEN_KEY, 'mock-jwt-token');
      
//       return true;
//     }
//     return false;
//   }

//   logout(): void {
//     this.currentUser.set(null);
//     this.isAuthenticated.set(false);
    
//     localStorage.removeItem(this.USER_KEY);
//     localStorage.removeItem(this.TOKEN_KEY);
//   }

//   isLoggedIn(): boolean {
//     return this.isAuthenticated();
//   }

//   getCurrentUser(): string | null {
//     return this.currentUser()?.username || null;
//   }

//   private getStoredUser(): User | null {
//     const stored = localStorage.getItem(this.USER_KEY);
//     return stored ? JSON.parse(stored) : null;
//   }
// }