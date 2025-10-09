// profile/profile.ts
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { DarkModeService } from 'src/app/services/dark-mode';
import { AuthService, User } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language';
import { NotificationService } from 'src/app/services/notification';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  notificationService = inject(NotificationService);
  languageService = inject(LanguageService);
  darkModeService = inject(DarkModeService);
  private router = inject(Router);

  profileForm!: FormGroup;
  isEditing = false;
  isSubmitting = false;
  currentUser: User | null = null;

  // Avatar options
  avatarOptions = [
    '👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', 
    '🦸', '🦸‍♀️', '🎭', '😊', '😎', '🤩', '🧐', '🤓'
  ];

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.loadUserProfile();
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadUserProfile(): void {
    // Get current user from AuthService
    this.currentUser = this.authService.getCurrentUserObject();
    
    // If no user in AuthService but logged in, try localStorage as fallback
    if (!this.currentUser && this.authService.isLoggedIn()) {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        this.currentUser = JSON.parse(userData);
      }
    }
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      username: [
        this.currentUser?.username || '', 
        [Validators.required, Validators.minLength(3), Validators.maxLength(20)]
      ],
      email: [
        this.currentUser?.email || '', 
        [Validators.required, Validators.email]
      ],
      firstName: [
        this.currentUser?.firstName || '', 
        [Validators.required, Validators.minLength(2)]
      ],
      lastName: [
        this.currentUser?.lastName || '', 
        [Validators.required, Validators.minLength(2)]
      ],
      phone: [
        this.currentUser?.phone || '', 
        [Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)]
      ],
      avatar: [this.currentUser?.avatar || '👤'],
      bio: [this.currentUser?.bio || '', Validators.maxLength(200)]
    });

    // Disable form initially
    this.profileForm.disable();
  }

  getJoinDate(): string {
    if (!this.currentUser?.joinDate) return '';
    
    const joinDate = new Date(this.currentUser.joinDate);
    return this.languageService.currentLanguage() === 'ar' 
      ? joinDate.toLocaleDateString('ar-EG')
      : joinDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
  }

  enableEditing(): void {
    this.isEditing = true;
    this.profileForm.enable();
    // Keep email disabled as it's usually not editable
    this.profileForm.get('email')?.disable();
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.profileForm.disable();
    // Reset form to original values
    this.profileForm.patchValue({
      username: this.currentUser?.username || '',
      email: this.currentUser?.email || '',
      firstName: this.currentUser?.firstName || '',
      lastName: this.currentUser?.lastName || '',
      phone: this.currentUser?.phone || '',
      avatar: this.currentUser?.avatar || '👤',
      bio: this.currentUser?.bio || ''
    });
  }

  selectAvatar(avatar: string): void {
    this.profileForm.patchValue({ avatar });
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      const formData = this.profileForm.value;
      
      if (!this.currentUser) {
        throw new Error('No user found');
      }

      const updatedUser: User = {
        ...this.currentUser,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        avatar: formData.avatar,
        bio: formData.bio
      };

      // Use AuthService to update profile
      const success = this.authService.updateProfile(updatedUser);
      
      if (success) {
        this.currentUser = updatedUser;
        this.isEditing = false;
        this.profileForm.disable();

        // Show success message
        const successMessage = this.languageService.currentLanguage() === 'ar'
          ? 'تم تحديث الملف الشخصي بنجاح!'
          : 'Profile updated successfully!';
        
        this.notificationService.show(successMessage, 'success');
      } else {
        throw new Error('Failed to update profile');
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = this.languageService.currentLanguage() === 'ar'
        ? 'حدث خطأ أثناء تحديث الملف الشخصي'
        : 'An error occurred while updating your profile';
      
      this.notificationService.show(errorMessage, 'error');
    } finally {
      this.isSubmitting = false;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.profileForm.get(controlName);
    
    if (!control || !control.errors) return '';

    if (control.hasError('required')) {
      return this.languageService.currentLanguage() === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required';
    }
    
    if (control.hasError('email')) {
      return this.languageService.currentLanguage() === 'ar' ? 'البريد الإلكتروني غير صالح' : 'Please enter a valid email';
    }
    
    if (control.hasError('minlength')) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return this.languageService.currentLanguage() === 'ar' 
        ? `يجب أن يحتوي الحقل على الأقل على ${requiredLength} أحرف` 
        : `Must be at least ${requiredLength} characters`;
    }
    
    if (control.hasError('maxlength')) {
      const requiredLength = control.errors['maxlength'].requiredLength;
      return this.languageService.currentLanguage() === 'ar' 
        ? `يجب أن يحتوي الحقل على الأكثر على ${requiredLength} أحرف` 
        : `Must be at most ${requiredLength} characters`;
    }
    
    if (control.hasError('pattern')) {
      return this.languageService.currentLanguage() === 'ar' 
        ? 'تنسيق غير صالح' 
        : 'Invalid format';
    }
    
    return '';
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.profileForm.get(controlName);
    return control ? control.hasError(errorName) && (control.dirty || control.touched) : false;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}