import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DarkModeService } from '../../services/dark-mode';
import { LanguageService } from '../../services/language';
import { TranslationService } from '../../services/translation';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  darkModeService = inject(DarkModeService);
  languageService = inject(LanguageService);
  translationService = inject(TranslationService);
  authService = inject(AuthService);

  user = {
    email: '',
    password: ''
  };

  constructor(private router: Router) {
    // Check if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  onLogin(form: NgForm) {
    if (form.valid) {
      const success = this.authService.login(this.user.email, this.user.password);
      if (success) {
        this.router.navigate(['/movies/now_playing']);
      } else {
        alert('❌ Invalid email or password!');
      }
    } else {
      alert('❌ Form invalid!');
    }
  }
}



// import { CommonModule } from '@angular/common';
// import { Component, inject } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { DarkModeService } from '../../services/dark-mode';
// import { LanguageService } from '../../services/language';
// import { TranslationService } from '../../services/translation';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [
//     CommonModule, 
//     FormsModule,
//     RouterModule,
//     MatCardModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//     MatIconModule
//   ],
//   templateUrl: './login.html',
//   styleUrls: ['./login.css']
// })
// export class LoginComponent {
//   darkModeService = inject(DarkModeService);
//   languageService = inject(LanguageService);
//   translationService = inject(TranslationService);

//   user = {
//     email: '',
//     password: ''
//   };

//   constructor(private router: Router) {
//     // التحقق إذا كان المستخدم مسجل دخول بالفعل
//     const isLoggedIn = localStorage.getItem('isLoggedIn');
//     if (isLoggedIn === 'true') {
//       this.router.navigate(['/home']);
//     }
//   }

//   // تسجيل الدخول
//   onLogin(form: NgForm) {
//     if (form.valid) {
//       const savedUsers = localStorage.getItem('users');
//       if (!savedUsers) { alert('❌ No users found!'); return; }

//       const users: any[] = JSON.parse(savedUsers);
//       const foundUser = users.find(u => u.email === this.user.email);

//       if (foundUser) {
//         if (foundUser.password === this.user.password) {
//           // حفظ حالة تسجيل الدخول
//           localStorage.setItem('isLoggedIn', 'true');
//           localStorage.setItem('currentUser', JSON.stringify(foundUser));
//           // alert(`✅ Login successful! Welcome ${foundUser.firstName}`);
//           // التوجيه لصفحة Home
//           this.router.navigate(['/home']);
//         } else {
//           alert('❌ Incorrect password!');
//         }
//       } else {
//         alert('❌ Email not found!');
//       }
//     } else {
//       alert('❌ Form invalid!');
//     }
//   }
// }

