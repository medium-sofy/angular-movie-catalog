import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { WishlistService } from '../../services/wishlist.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faHeart as fasHeart, 
  faTimes, 
  faHeartBroken,
  faCalendar,
  faStar,
  faClock,
  faArrowLeft,
  faInfoCircle 

} from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule, DatePipe],
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  // Icons
  fasHeart = fasHeart;
  faTimes = faTimes;
  faHeartBroken = faHeartBroken;
  faCalendar = faCalendar;
  faStar = faStar;
  faClock = faClock;
  faArrowLeft = faArrowLeft;
  faInfoCircle = faInfoCircle;
  
  wishlistItems: any[] = [];

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.wishlistItems = this.wishlistService.getWishlistItems();
  }


  isInWishlist(id: number): boolean {
    return this.wishlistService.isInWishlist(id);
  }

  toggle(movie: any): void {
    this.wishlistService.toggleWishlist(movie);
    this.wishlistItems = this.wishlistService.getWishlistItems();
  }

  remove(id: number): void {
    this.wishlistService.removeFromWishlist(id);
    this.wishlistItems = this.wishlistService.getWishlistItems();
  }

  getPosterUrl(posterPath: string | null): string {
    return posterPath 
      ? `https://image.tmdb.org/t/p/w500/${posterPath}`
      : 'assets/images/placeholder.png';
  }

  handleImageError(event: Event): void {
    const element = event.target as HTMLImageElement;
    if (element) {
      element.src = 'assets/images/placeholder.png';
    }
  }
}