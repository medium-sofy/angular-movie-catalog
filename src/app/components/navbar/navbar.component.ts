import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilm, faHeart } from '@fortawesome/free-solid-svg-icons';
import { WishlistCounterComponent } from '../wishlist-counter/wishlist-counter.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, WishlistCounterComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  faFilm = faFilm;
  faHeart = faHeart;
}
