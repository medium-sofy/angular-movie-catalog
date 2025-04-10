import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilm, faHeart } from '@fortawesome/free-solid-svg-icons';
import { WishlistCounterComponent } from '../wishlist-counter/wishlist-counter.component';
import { LanguageService } from '../../services/language.service';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule, RouterModule, FontAwesomeModule, WishlistCounterComponent,    FormsModule 
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  faFilm = faFilm;
  faHeart = faHeart;
  selectedLanguage: string;
  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
    { code: 'fr', name: 'Français' },
    { code: 'zh', name: '中文' }
  ];

  constructor(private languageService: LanguageService) {
    this.selectedLanguage = languageService.getCurrentLanguage();
  }

  onLanguageChange(): void {
    this.languageService.setLanguage(this.selectedLanguage);
  }
}


