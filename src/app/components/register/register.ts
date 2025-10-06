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
  selector: 'app-register',
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
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  user = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private router: Router) {}

  // تسجيل المستخدم وتخزينه في LocalStorage
  onRegister(form: NgForm) {
    if (form.valid && this.user.password === this.user.confirmPassword) {
      // جلب المستخدمين الحاليين من LocalStorage
      let users: any[] = [];
      const savedUsers = localStorage.getItem('users');
      if (savedUsers) {
        users = JSON.parse(savedUsers);
      }
  
      // التحقق من الايميل موجود بالفعل
      const emailExists = users.some(u => u.email === this.user.email);
      if (emailExists) {
        alert('❌ Email already registered!');
        return;
      }
  
      // إضافة المستخدم الجديد
      users.push(this.user);
      localStorage.setItem('users', JSON.stringify(users));
  
      alert('✅ Registration successful!');
      form.resetForm();
      // الانتقال لصفحة Login بعد التسجيل
      this.router.navigate(['/login']);
    } else {
      alert('❌ Form invalid or passwords do not match!');
    }
  }
}
