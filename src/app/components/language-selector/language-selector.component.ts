import { Component } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent {
  selectedLanguage: string;
  supportedLanguages: string[];

  constructor(private languageService: LanguageService) {
    this.selectedLanguage = languageService.getCurrentLanguage();
    this.supportedLanguages = languageService.getSupportedLanguages();
  }

  onLanguageChange(): void {
    this.languageService.setLanguage(this.selectedLanguage);
  }
}