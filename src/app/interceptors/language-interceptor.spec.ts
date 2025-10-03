import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LanguageService } from '../services/language';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  const languageService = inject(LanguageService);
  
  // إضافة معلمة اللغة لطلبات TMDB فقط
  if (req.url.includes('api.themoviedb.org')) {
    const modifiedReq = req.clone({
      params: req.params.set('language', languageService.currentLanguage())
    });
    return next(modifiedReq);
  }
  
  return next(req);
};