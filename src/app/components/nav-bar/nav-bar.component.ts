import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilm, faHeart } from '@fortawesome/free-solid-svg-icons';
import { WishlistCounterComponent } from '../wishlist-counter/wishlist-counter.component';

@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule, RouterModule, FontAwesomeModule, WishlistCounterComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  faFilm = faFilm;
  faHeart = faHeart;
}
