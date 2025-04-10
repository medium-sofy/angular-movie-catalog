import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';


@Component({
  selector: 'app-movie-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent {
  @Input() movie: any;
  @Input() showLink: boolean = true; // Whether to show as a link to detail page
  @Output() watchlistToggle = new EventEmitter<any>();
  constructor(private wishlistService: WishlistService) {}

  /**
   * Constructs the poster URL from a path
   */
  getPosterUrl(posterPath: string): string {
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  }

  /**
   * Handles image loading errors
   */
  handleImageError(event: any): void {
    event.target.src = 'assets/images/placeholder.png';
  }

  /**
   * Toggles watchlist status and emits event to parent
   */
  onToggleWatchlist(event: Event): void {
    // Prevent navigation when clicking the star
    event.preventDefault();
    event.stopPropagation();
    
    this.watchlistToggle.emit(this.movie);
  }
  ngOnChanges() {
    if (this.movie) {
      this.movie.inWatchlist = this.wishlistService.isInWishlist(this.movie.id);
    }
  }

  /**
   * Gets formatted genre string for display
   */
  getGenreString(): string {
    if (!this.movie.genres) return '';
    
    // Handle both array of strings and array of objects
    if (typeof this.movie.genres[0] === 'string') {
      return this.movie.genres.join(', ');
    } else if (this.movie.genres[0]?.name) {
      return this.movie.genres.map((g: any) => g.name).join(', ');
    }
    
    return '';
  }
}