import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, FormControl } from '@angular/forms';
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
import { NotificationService } from '../../services/notification';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  darkModeService = inject(DarkModeService);
  languageService = inject(LanguageService);
  translationService = inject(TranslationService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  // Custom validator to check if passwords match
  private passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  };

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      this.passwordValidator()
    ]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  isSubmitting = false;
  registerError = '';
  showPassword = false;
  showConfirmPassword = false;
  passwordStrength: 'weak' | 'medium' | 'strong' | null | undefined = undefined;
  private passwordStrengthSub: Subscription | null = null;
  private formChangesSub: Subscription | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Subscribe to password value changes to update strength indicator
    this.passwordStrengthSub = this.registerForm.get('password')!.valueChanges.subscribe(
      (value: string | null) => {
        if (value) {
          this.checkPasswordStrength(value);
        } else {
          this.passwordStrength = undefined;
        }
      }
    );

    // Subscribe to form changes to clear errors when user starts typing
    this.formChangesSub = this.registerForm.valueChanges.subscribe(() => {
      if (this.registerError) {
        this.registerError = '';
      }
      
      // Clear any error notifications when user starts typing in any field
      if (this.registerForm.touched) {
        const activeNotifications = this.notificationService.getNotificationCountByType();
        if (activeNotifications.error > 0) {
          this.notificationService.dismissAll();
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.passwordStrengthSub) {
      this.passwordStrengthSub.unsubscribe();
    }
    if (this.formChangesSub) {
      this.formChangesSub.unsubscribe();
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

  // Getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  // Check if field has error
  hasError(controlName: string, errorName: string): boolean {
    const control = this.registerForm.get(controlName);
    return control ? control.hasError(errorName) && (control.dirty || control.touched) : false;
  }

  // Get error message for a field
  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    
    if (!control || !control.errors) return '';

    if (control.hasError('required')) {
      return this.languageService.currentLanguage() === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required';
    }
    
    if (control.hasError('email')) {
      return this.languageService.currentLanguage() === 'ar' ? 'البريد الإلكتروني غير صالح' : 'Please enter a valid email';
    }
    
    if (control.hasError('minlength')) {
      return this.languageService.currentLanguage() === 'ar' 
        ? `يجب أن يحتوي الحقل على الأقل على ${control.errors['minlength'].requiredLength} أحرف` 
        : `Must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    
    if (control.hasError('invalidPassword')) {
      return this.languageService.currentLanguage() === 'ar'
        ? 'يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير ورقم'
        : 'Password must contain at least one uppercase letter, one lowercase letter, and a number';
    }
    
    if (control.hasError('passwordMismatch')) {
      return this.languageService.currentLanguage() === 'ar'
        ? 'كلمات المرور غير متطابقة'
        : 'Passwords do not match';
    }
    
    return '';
  }

  // Handle form submission
  async onRegister() {
    if (this.registerForm.invalid) {
      // Mark all fields as touched to show validation messages
      Object.values(this.registerForm.controls).forEach(control => {
        control.markAsTouched();
      });
      
      // Show form validation error
      const errorMessage = this.languageService.currentLanguage() === 'ar'
        ? 'الرجاء إدخال بيانات صحيحة'
        : 'Please enter valid information';
      this.notificationService.error(errorMessage);
      return;
    }

    this.isSubmitting = true;
    this.registerError = '';

    try {
      const formValue = this.registerForm.value;
      
      // Check if email already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const emailExists = users.some((u: any) => u.email === formValue.email);
      
      if (emailExists) {
        const errorMessage = this.languageService.currentLanguage() === 'ar'
          ? 'البريد الإلكتروني مسجل مسبقاً. الرجاء استخدام بريد إلكتروني آخر أو تسجيل الدخول.'
          : 'This email is already registered. Please use a different email or log in.';
        this.registerError = errorMessage;
        this.notificationService.error(errorMessage);
        return;
      }
      
      // Add new user
      const newUser = {
        id: Date.now().toString(),
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        password: formValue.password,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Show success message with auto-dismiss
      const successMessage = this.languageService.currentLanguage() === 'ar'
        ? '✅ تم إنشاء الحساب بنجاح! يتم تحويلك إلى صفحة تسجيل الدخول...'
        : '✅ Account created successfully! Redirecting to login...';
      
      this.notificationService.success(successMessage, 1500);
      
      // Clear form
      this.registerForm.reset();
      this.passwordStrength = undefined;
      
      // Redirect to login after a short delay
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
      
    } catch (error) {
      const errorMessage = this.languageService.currentLanguage() === 'ar'
        ? '❌ حدث خطأ غير متوقع أثناء محاولة التسجيل. يرجى المحاولة مرة أخرى لاحقاً.'
        : '❌ An unexpected error occurred during registration. Please try again later.';
      this.registerError = errorMessage;
      this.notificationService.error(errorMessage);
      console.error('Registration error:', error);
    } finally {
      this.isSubmitting = false;
    }
  }
}
