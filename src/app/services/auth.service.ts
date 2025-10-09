// auth.service.ts
import { Injectable, signal } from '@angular/core';

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string; // optional - only stored locally for mock
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  joinDate?: string;
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
      password, // only for mock
      firstName: '',
      lastName: '',
      avatar: '👤',
      joinDate: new Date().toISOString()
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

  /** ✅ Update user profile */
  updateProfile(updatedUser: User): boolean {
    try {
      const users = this.getStoredUsers();
      const userIndex = users.findIndex(u => u.id === updatedUser.id);
      
      if (userIndex === -1) {
        console.error('User not found');
        return false;
      }

      // Keep password from original user if not provided in update
      const password = users[userIndex].password;
      users[userIndex] = { ...updatedUser, password };
      
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      
      // Update current user in session if it's the same user
      const currentUser = this.currentUser();
      if (currentUser && currentUser.id === updatedUser.id) {
        this.setSession(users[userIndex]);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  }
// Add this to your auth.service.ts
/** ✅ Change user password */
changePassword(currentPassword: string, newPassword: string): boolean {
  const currentUser = this.currentUser();
  if (!currentUser) return false;

  const users = this.getStoredUsers();
  const userIndex = users.findIndex(u => u.id === currentUser.id);
  
  if (userIndex === -1) return false;

  // Verify current password
  if (users[userIndex].password !== currentPassword) {
    return false;
  }

  // Update password
  users[userIndex].password = newPassword;
  localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

  // Update current user in signal
  this.currentUser.set({ ...currentUser, password: newPassword });

  return true;
}

/** ✅ Check if current password is correct */
verifyCurrentPassword(password: string): boolean {
  const currentUser = this.currentUser();
  if (!currentUser) return false;

  const users = this.getStoredUsers();
  const user = users.find(u => u.id === currentUser.id);
  
  return user?.password === password;
}
  /** ✅ Get user by ID */
  getUserById(id: number): User | null {
    const users = this.getStoredUsers();
    return users.find(u => u.id === id) || null;
  }

  /** ✅ Get all users (for admin purposes) */
  getAllUsers(): User[] {
    return this.getStoredUsers();
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

  /** ✅ Get full current user object */
  getCurrentUserObject(): User | null {
    return this.currentUser();
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
// import { Injectable, signal } from '@angular/core';

// export interface User {
//   id: number;
//   username: string;
//   email: string;
//   password?: string; // optional - only stored locally for mock
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private readonly USERS_KEY = 'users';
//   private readonly CURRENT_USER_KEY = 'current_user';
//   private readonly TOKEN_KEY = 'auth_token';
//   private readonly LOGIN_FLAG_KEY = 'isLoggedIn';

//   currentUser = signal<User | null>(this.getStoredCurrentUser());
//   isAuthenticated = signal<boolean>(!!this.getStoredCurrentUser());

//   constructor() {}

//   /** ✅ Register a new user (stored in localStorage for mock) */
//   register(username: string, email: string, password: string): boolean {
//     if (!username || !email || !password) return false;

//     const users = this.getStoredUsers();
//     if (users.some(u => u.email === email)) {
//       alert('❌ Email already registered!');
//       return false;
//     }

//     const newUser: User = {
//       id: Date.now(),
//       username,
//       email,
//       password // only for mock
//     };

//     users.push(newUser);
//     localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

//     // Auto-login after register
//     this.setSession(newUser);
//     return true;
//   }

//   /** ✅ Login using stored mock users */
//   login(email: string, password: string): boolean {
//     const users = this.getStoredUsers();
//     const foundUser = users.find(u => u.email === email);

//     if (foundUser && foundUser.password === password) {
//       this.setSession(foundUser);
//       return true;
//     }

//     return false;
//   }

//   /** ✅ Clear session and local storage flags */
//   logout(): void {
//     this.currentUser.set(null);
//     this.isAuthenticated.set(false);

//     localStorage.removeItem(this.CURRENT_USER_KEY);
//     localStorage.removeItem(this.TOKEN_KEY);
//     localStorage.setItem(this.LOGIN_FLAG_KEY, 'false');
//   }

//   /** ✅ Return true if logged in */
//   isLoggedIn(): boolean {
//     return this.isAuthenticated();
//   }

//   /** ✅ Get username of current user */
//   getCurrentUser(): string | null {
//     return this.currentUser()?.username || null;
//   }

//   /** 🧠 Private helpers */

//   private setSession(user: User): void {
//     this.currentUser.set(user);
//     this.isAuthenticated.set(true);

//     localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
//     localStorage.setItem(this.TOKEN_KEY, 'mock-jwt-token');
//     localStorage.setItem(this.LOGIN_FLAG_KEY, 'true');
//   }

//   private getStoredUsers(): User[] {
//     const data = localStorage.getItem(this.USERS_KEY);
//     return data ? JSON.parse(data) : [];
//   }

//   private getStoredCurrentUser(): User | null {
//     const data = localStorage.getItem(this.CURRENT_USER_KEY);
//     return data ? JSON.parse(data) : null;
//   }
// }


