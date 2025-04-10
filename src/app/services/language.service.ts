import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  private directionSubject = new BehaviorSubject<'ltr' | 'rtl'>('ltr');
  direction$ = this.directionSubject.asObservable();

  private supportedLanguages = ['en', 'ar', 'fr', 'zh'];

  constructor() {
    // Initialize with default language
    this.setLanguage('en');
  }

  setLanguage(lang: string): void {
    if (this.supportedLanguages.includes(lang)) {
      this.currentLanguageSubject.next(lang);
      // Set direction based on language
      const direction = lang === 'ar' ? 'rtl' : 'ltr';
      this.directionSubject.next(direction);
      // Update document direction
      document.documentElement.dir = direction;
    }
  }

  getSupportedLanguages(): string[] {
    return this.supportedLanguages;
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  getCurrentDirection(): 'ltr' | 'rtl' {
    return this.directionSubject.value;
  }
}
