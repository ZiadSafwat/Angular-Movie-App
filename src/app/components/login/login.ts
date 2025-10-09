import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DarkModeService } from '../../services/dark-mode';
import { LanguageService } from '../../services/language';
import { TranslationService } from '../../services/translation';
import { AuthService } from '../../services/auth.service'; // Keep this import
import { NotificationService } from '../../services/notification';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  darkModeService = inject(DarkModeService);
  languageService = inject(LanguageService);
  translationService = inject(TranslationService);
  authService = inject(AuthService); // This should use the imported service
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);
  private router = inject(Router); // Move router to inject

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      this.passwordValidator()
    ]]
  });

  isSubmitting = false;
  loginError = '';
  showPassword = false;
  passwordStrength: 'weak' | 'medium' | 'strong' | null | undefined = undefined;  
  private passwordStrengthSub: Subscription | null = null;

  constructor() {
    // Check if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/movies/now_playing']);
    }
  }

  ngOnInit(): void {
    // Subscribe to password value changes to update strength indicator
    this.passwordStrengthSub = this.loginForm.get('password')!.valueChanges.subscribe(
      (value: string | null) => {
        if (value) {
          this.checkPasswordStrength(value);
        } else {
          this.passwordStrength = null;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.passwordStrengthSub?.unsubscribe();
  }

  // Check password strength based on complexity
  private checkPasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength = undefined;
      return;
    }
    
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLong = password.length >= 12;

    if (password.length < 8) {
      this.passwordStrength = 'weak';
    } else if (hasLetters && hasNumbers && hasSpecialChars && isLong) {
      this.passwordStrength = 'strong';
    } else if ((hasLetters && hasNumbers) || (hasLetters && hasSpecialChars) || (hasNumbers && hasSpecialChars)) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'weak';
    }
  }

  // Custom password validator
  private passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const hasUpperCase = /[A-Z]/.test(control.value);
      const hasLowerCase = /[a-z]/.test(control.value);
      const hasNumeric = /[0-9]/.test(control.value);
      const valid = hasUpperCase && hasLowerCase && hasNumeric;
      return valid ? null : { invalidPassword: true };
    };
  }

  // Getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  // Check if field has error
  hasError(controlName: string, errorName: string): boolean {
    const control = this.loginForm.get(controlName);
    return control ? control.hasError(errorName) && (control.dirty || control.touched) : false;
  }

  // Get error message for a field
  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    
    if (!control || !control.errors) return '';

    if (control.hasError('required')) {
      return this.languageService.currentLanguage() === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required';
    }
    
    if (control.hasError('email')) {
      return this.languageService.currentLanguage() === 'ar' ? 'البريد الإلكتروني غير صالح' : 'Please enter a valid email';
    }
    
    if (control.hasError('minlength')) {
      return this.languageService.currentLanguage() === 'ar' 
        ? `يجب أن تحتوي كلمة المرور على الأقل على ${control.errors['minlength'].requiredLength} أحرف` 
        : `Password must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    
    if (control.hasError('invalidPassword')) {
      return this.languageService.currentLanguage() === 'ar'
        ? 'يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير ورقم'
        : 'Password must contain at least one uppercase letter, one lowercase letter, and a number';
    }
    
    return '';
  }
    
  async onLogin() {
    console.log('Login attempt started...'); // Debug log
    
    if (this.loginForm.invalid) {
      console.log('Form is invalid'); // Debug log
      Object.values(this.loginForm.controls).forEach(control => {
        control.markAsTouched();
      });
      
      const errorMessage = this.languageService.currentLanguage() === 'ar'
        ? 'الرجاء إدخال بيانات صحيحة'
        : 'Please enter valid information';
      this.notificationService.show(errorMessage, 'error');
      return;
    }

    this.isSubmitting = true;
    this.loginError = '';

    try {
      const formValue = this.loginForm.value;
      console.log('Login attempt for:', formValue.email); // Debug log
      
      // Use AuthService for login
      const loginSuccess = this.authService.login(formValue.email!, formValue.password!);
      
      if (loginSuccess) {
        console.log('Login successful via AuthService'); // Debug log
        
        const successMessage = this.languageService.currentLanguage() === 'ar'
          ? 'تم تسجيل الدخول بنجاح!'
          : 'Logged in successfully!';
        this.notificationService.show(successMessage, 'success');
        
        // Redirect after short delay
        setTimeout(() => {
          console.log('Navigating to /movies/now_playing...'); // Debug log
          this.router.navigate(['/movies/now_playing']).then(success => {
            console.log('Navigation result:', success); // Debug log
            if (!success) {
              console.error('Navigation failed! Check route configuration.');
            }
          });
        }, 1000);
        
      } else {
        console.log('Login failed - invalid credentials'); // Debug log
        const errorMessage = this.languageService.currentLanguage() === 'ar'
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
          : 'Invalid email or password';
        this.loginError = errorMessage;
        this.notificationService.show(errorMessage, 'error');
      }
      
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = this.languageService.currentLanguage() === 'ar'
        ? 'حدث خطأ أثناء محاولة تسجيل الدخول. يرجى المحاولة مرة أخرى لاحقاً.'
        : 'An error occurred while trying to log in. Please try again later.';
      this.loginError = errorMessage;
      this.notificationService.show(errorMessage, 'error');
    } finally {
      this.isSubmitting = false;
    }
  }
}

