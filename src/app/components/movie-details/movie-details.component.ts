import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  imports: [MovieCardComponent],
  styleUrls: ['./movie-details.component.css'],
  // Include the necessary pipes as providers
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
  maxReviewsInitial = 2; // Initial number of reviews to show

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
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
      next: (data) => {
        this.movie = data;
        this.loading = false;
        console.log(this.movie);
      },
      error: (err) => {
        this.error = 'Failed to load movie details: ' + err.message;
        this.loading = false;
      },
    });
  }

  getRecommendedMovies(id: number): void {
    this.recommendationsLoading = true;

    this.movieService.getMovieRecommendations(id).subscribe({
      next: (response: any) => {
        // Take only the first 6 recommendations
        this.recommendedMovies = response.results?.slice(0, 6) || [];
                this.recommendationsLoading = false;
                console.log('Recommended movies loaded:', this.recommendedMovies.length);
      },
      error: (err) => {
        console.error('Failed to load recommended movies:', err);
               this.recommendationsLoading = false;
        
      },
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
    movie.inWatchlist = !movie.inWatchlist;
    // Implement your watchlist logic here
  }

  /**
   * Gets the initials from a company name for use in the placeholder
   */
  getCompanyInitials(name: string): string {
    if (!name) return '?';

    // For names with multiple words, get first letter of each word (up to 2)
    const words = name.split(' ');
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }

    // For single word names, return first 2 letters
    return name.substring(0, 2).toUpperCase();
  }

  goToHomePage(): void {
    this.router.navigate(['/']);
  }
  
  /**
   * Fetches movie reviews from the API
   */
  getMovieReviews(id: number): void {
    this.reviewsLoading = true;
    this.reviewsError = '';
    
    this.movieService.getMovieReviews(id).subscribe({
      next: (response: any) => {
        this.reviews = response.results || [];
        // Format the reviews to make them more presentable
        this.reviews = this.reviews.map(review => ({
          ...review,
          created_at: new Date(review.created_at),
          // Truncate content for preview if it's too long
          content_preview: review.content.length > 300 ? 
            review.content.substring(0, 300) + '...' : 
            review.content,
          expanded: false
        }));
        
        // Set initial displayed reviews
        this.updateDisplayedReviews();
        this.reviewsLoading = false;
      },
      error: (err) => {
        this.reviewsError = 'Failed to load reviews';
        this.reviewsLoading = false;
        console.error('Error loading reviews:', err);
      }
    });
  }
  
  /**
   * Updates the displayed reviews based on showAllReviews flag
   */
  updateDisplayedReviews(): void {
    if (this.showAllReviews) {
      this.displayedReviews = this.reviews;
    } else {
      this.displayedReviews = this.reviews.slice(0, this.maxReviewsInitial);
    }
  }
  
  /**
   * Toggles between showing all reviews or just initial ones
   */
  toggleReviews(): void {
    this.showAllReviews = !this.showAllReviews;
    this.updateDisplayedReviews();
  }
  
  /**
   * Toggles expansion state of a single review
   */
  toggleReviewExpansion(review: any): void {
    review.expanded = !review.expanded;
  }
  
  /**
   * Formats author name for display (handles missing names)
   */
  formatAuthorName(review: any): string {
    if (review.author_details && review.author_details.name && review.author_details.name.trim()) {
      return review.author_details.name;
    }
    return review.author || 'Anonymous';
  }
  
  /**
   * Formats review date for display
   */
  formatReviewDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} months ago`;
    } else {
      return `${Math.floor(diffDays / 365)} years ago`;
    }
  }
  
  /**
   * Gets the rating color based on score
   */
  getRatingColor(rating: number): string {
    if (!rating && rating !== 0) return 'var(--secondary-color)';
    if (rating >= 7) return '#2ecc71'; // green
    if (rating >= 5) return '#f39c12'; // orange
    return '#e74c3c'; // red
  }
  
  /**
   * Gets avatar URL for the review author or a default
   */
  getAvatarUrl(review: any): string {
    if (review.author_details && review.author_details.avatar_path) {
      return `https://image.tmdb.org/t/p/w100${review.author_details.avatar_path}`;
    }
    return 'https://robohash.org/mail@ashallendesign.co.uk'
  }
  
}
