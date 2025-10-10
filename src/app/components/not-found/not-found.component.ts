import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DarkModeService } from 'src/app/services/dark-mode';
import { LanguageService } from 'src/app/services/language';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="not-found-container" [class.dark]="darkModeService.isDarkMode()" [class.rtl]="languageService.isRTL()">
      <div class="error-content">
        <div class="error-icon">🚫</div>
        <h1>404</h1>
        <h2>
          {{ languageService.currentLanguage() === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found' }}
        </h2>
        <p>
          {{ languageService.currentLanguage() === 'ar' 
             ? 'عذرًا، الصفحة التي تبحث عنها غير موجودة.' 
             : 'Sorry, the page you are looking for does not exist.' }}
        </p>
        <div class="action-buttons">
          <a routerLink="/" class="btn btn-primary">
            <i class="fas fa-home me-2"></i>
            {{ languageService.currentLanguage() === 'ar' ? 'العودة للرئيسية' : 'Back to Home' }}
          </a>
          <button class="btn btn-secondary" (click)="goBack()">
            <i class="fas fa-arrow-left me-2"></i>
            {{ languageService.currentLanguage() === 'ar' ? 'العودة للخلف' : 'Go Back' }}
          </button>
        </div>
      </div>
      
      <!-- Decorative Elements -->
      <div class="decoration deco-1">🎬</div>
      <div class="decoration deco-2">📽️</div>
      <div class="decoration deco-3">🎭</div>
      <div class="decoration deco-4">✨</div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, #fcbf06, #f2a900);
      position: relative;
      overflow: hidden;
    }
    
    .not-found-container.dark {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    }

    .not-found-container.rtl {
      direction: rtl;
    }

    .error-content {
      max-width: 500px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }

    .error-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      animation: bounce 2s infinite;
    }

    h1 {
      font-size: 8rem;
      margin: 0;
      color: #000000;
      line-height: 1;
      font-weight: 900;
      text-shadow: 3px 3px 0 rgba(255, 255, 255, 0.3);
    }

    .dark h1 {
      color: #fcbf06;
      text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
    }

    h2 {
      font-size: 2.5rem;
      margin: 1rem 0;
      color: #000000;
      font-weight: 700;
    }

    .dark h2 {
      color: #ffffff;
    }

    p {
      margin-bottom: 2rem;
      font-size: 1.2rem;
      color: #333333;
      line-height: 1.6;
    }

    .dark p {
      color: #e2e8f0;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 140px;
    }

    .btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .btn-primary {
      background: linear-gradient(135deg, #000000, #333333);
      color: #fcbf06;
      border: 2px solid #000000;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #333333, #000000);
      color: #fcbf06;
      border-color: #000000;
    }

    .btn-secondary {
      background: transparent;
      color: #000000;
      border: 2px solid #000000;
    }

    .btn-secondary:hover {
      background: #000000;
      color: #fcbf06;
    }

    .dark .btn-secondary {
      color: #fcbf06;
      border-color: #fcbf06;
    }

    .dark .btn-secondary:hover {
      background: #fcbf06;
      color: #000000;
    }

    /* Decorative Elements */
    .decoration {
      position: absolute;
      font-size: 3rem;
      opacity: 0.1;
      animation: float 6s ease-in-out infinite;
      z-index: 1;
    }

    .deco-1 {
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .deco-2 {
      top: 20%;
      right: 15%;
      animation-delay: 1.5s;
    }

    .deco-3 {
      bottom: 15%;
      left: 20%;
      animation-delay: 3s;
    }

    .deco-4 {
      bottom: 10%;
      right: 10%;
      animation-delay: 4.5s;
    }

    /* Animations */
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-20px);
      }
      60% {
        transform: translateY(-10px);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-20px) rotate(10deg);
      }
    }

    /* RTL Support */
    .not-found-container.rtl .me-2 {
      margin-right: 0 !important;
      margin-left: 0.5rem !important;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      h1 {
        font-size: 6rem;
      }

      h2 {
        font-size: 2rem;
      }

      p {
        font-size: 1.1rem;
      }

      .action-buttons {
        flex-direction: column;
        align-items: center;
      }

      .btn {
        width: 200px;
      }

      .decoration {
        font-size: 2rem;
      }
    }

    @media (max-width: 480px) {
      h1 {
        font-size: 4rem;
      }

      h2 {
        font-size: 1.5rem;
      }

      .error-icon {
        font-size: 3rem;
      }
    }
  `]
})
export class NotFoundComponent {
  darkModeService = inject(DarkModeService);
  languageService = inject(LanguageService);

  goBack(): void {
    window.history.back();
  }
}