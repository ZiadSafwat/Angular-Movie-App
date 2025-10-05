// import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, FormControl, NgForm } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'

})
export class AppComponent {

  user = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  showLogin = false; // false => show Register, true => show Login

  constructor() {
    // جلب المستخدم من LocalStorage لو موجود
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      console.log("Loaded User:", JSON.parse(savedUser));
    }
  }

  // تسجيل المستخدم وتخزينه في LocalStorage
  onRegister(form: any) {
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
      this.showLogin = true; // انتقل للصفحة Login بعد التسجيل
    } else {
      alert('❌ Form invalid or passwords do not match!');
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
          alert(`✅ Login successful! Welcome ${foundUser.firstName}`);
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


  

  toggleForm() {
    this.showLogin = !this.showLogin;
  
    const formContainer = document.querySelector('.form-container') as HTMLElement;
    if (formContainer) {
      formContainer.classList.remove('animate');
      void formContainer.offsetWidth; // force reflow
      formContainer.classList.add('animate');
    }
  }
  

}

