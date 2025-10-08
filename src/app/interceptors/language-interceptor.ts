import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { LanguageService } from '../services/language';

export const LanguageInterceptor: HttpInterceptorFn = (req, next) => {
  const languageService = inject(LanguageService);
  
  if (req.url.includes('api.themoviedb.org')) {
    const modifiedReq = req.clone({
      params: req.params.set('language', languageService.currentLanguage())
    });
    return next(modifiedReq);
  }
  return next(req);
};