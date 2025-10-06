import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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

  user = {
    email: '',
    password: ''
  };

  constructor(private router: Router) {
    // التحقق إذا كان المستخدم مسجل دخول بالفعل
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      this.router.navigate(['/home']);
    }
  }

  // تسجيل الدخول
  onLogin(form: NgForm) {
    if (form.valid) {
      const savedUsers = localStorage.getItem('users');
      if (!savedUsers) { alert('❌ No users found!'); return; }

      const users: any[] = JSON.parse(savedUsers);
      const foundUser = users.find(u => u.email === this.user.email);

      if (foundUser) {
        if (foundUser.password === this.user.password) {
          // حفظ حالة تسجيل الدخول
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', JSON.stringify(foundUser));
          alert(`✅ Login successful! Welcome ${foundUser.firstName}`);
          // التوجيه لصفحة Home
          this.router.navigate(['/home']);
        } else {
          alert('❌ Incorrect password!');
        }
      } else {
        alert('❌ Email not found!');
      }
    } else {
      alert('❌ Form invalid!');
    }
  }
}

