import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  imports: [MovieCardComponent],
  styleUrls: ['./movie-details.component.css'],
  providers: [DatePipe, DecimalPipe, RouterLink],
})
export class MovieDetailsComponent implements OnInit {
  movie: any;
  recommendedMovies: any[] = [];
  loading = true;
  recommendationsLoading = false;
  error = '';
  
  reviews: any[] = [];
  displayedReviews: any[] = [];
  reviewsLoading = false;
  reviewsError = '';
  showAllReviews = false;
  maxReviewsInitial = 2;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const movieId = Number(params.get('id'));
      if (movieId) {
        this.getMovieDetails(movieId);
        this.getRecommendedMovies(movieId);
        this.getMovieReviews(movieId);
      }
    });
  }

  getMovieDetails(id: number): void {
    this.loading = true;
    this.error = '';
    
    this.movieService.getMovieDetails(id).subscribe({
      next: (data: any) => {
        this.movie = {
          ...data,
          inWatchlist: this.wishlistService.isInWishlist(data.id)
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load movie details: ' + err.message;
        this.loading = false;
      }
    });
  }

  getRecommendedMovies(id: number): void {
    this.recommendationsLoading = true;
    
    this.movieService.getMovieRecommendations(id).subscribe({
      next: (response: any) => {
        this.recommendedMovies = (response.results ? response.results.slice(0, 6) : []).map((movie: any) => ({
          ...movie,
          inWatchlist: this.wishlistService.isInWishlist(movie.id)
        }));
        this.recommendationsLoading = false;
      },
      error: (err) => {
        console.error('Failed to load recommended movies:', err);
        this.recommendationsLoading = false;
      }
    });
  }

  getPosterUrl(posterPath: string): string {
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  }

  getCompanyLogoUrl(logoPath: string): string {
    return `https://image.tmdb.org/t/p/w200${logoPath}`;
  }

  handleImageError(event: any): void {
    event.target.src = 'assets/images/placeholder.png';
  }

  formatRuntime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  getLanguagesList(languages: any[]): string {
    if (!languages || languages.length === 0) {
      return 'Information not available';
    }
    return languages.map((lang) => lang.english_name || lang.name).join(', ');
  }

  toggleWatchlist(movie: any): void {
    this.wishlistService.toggleWishlist(movie);
    movie.inWatchlist = this.wishlistService.isInWishlist(movie.id);
    

    this.recommendedMovies = this.recommendedMovies.map(m => {
      if (m.id === movie.id) {
        return { ...m, inWatchlist: this.wishlistService.isInWishlist(m.id) };
      }
      return m;
    });
  }

  getCompanyInitials(name: string): string {
    if (!name) return '?';
    const words = name.split(' ');
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  goToHomePage(): void {
    this.router.navigate(['/']);
  }
  
  getMovieReviews(id: number): void {
    this.reviewsLoading = true;
    this.reviewsError = '';
    
    this.movieService.getMovieReviews(id).subscribe({
      next: (response: any) => {
        this.reviews = response.results || [];
        this.reviews = this.reviews.map(review => ({
          ...review,
          created_at: new Date(review.created_at),
          content_preview: review.content.length > 300 ? 
            review.content.substring(0, 300) + '...' : 
            review.content,
          expanded: false
        }));
        this.updateDisplayedReviews();
        this.reviewsLoading = false;
      },
      error: (err) => {
        this.reviewsError = 'Failed to load reviews';
        this.reviewsLoading = false;
      }
    });
  }
  
  updateDisplayedReviews(): void {
    this.displayedReviews = this.showAllReviews 
      ? this.reviews 
      : this.reviews.slice(0, this.maxReviewsInitial);
  }
  
  toggleReviews(): void {
    this.showAllReviews = !this.showAllReviews;
    this.updateDisplayedReviews();
  }
  
  toggleReviewExpansion(review: any): void {
    review.expanded = !review.expanded;
  }
  
  formatAuthorName(review: any): string {
    if (review.author_details?.name?.trim()) {
      return review.author_details.name;
    }
    return review.author || 'Anonymous';
  }
  
  formatReviewDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }
  
  getRatingColor(rating: number): string {
    if (!rating && rating !== 0) return 'var(--secondary-color)';
    if (rating >= 7) return '#2ecc71';
    if (rating >= 5) return '#f39c12';
    return '#e74c3c';
  }
  
  getAvatarUrl(review: any): string {
    if (review.author_details?.avatar_path) {
      return `https://image.tmdb.org/t/p/w100${review.author_details.avatar_path}`;
    }
    return 'https://robohash.org/mail@ashallendesign.co.uk';
  }
}