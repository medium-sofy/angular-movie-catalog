import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css'],
  // Include the necessary pipes as providers
  providers: [DatePipe, DecimalPipe, RouterLink]
})
export class MovieDetailsComponent implements OnInit {
  movie: any;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const movieId = Number(params.get('id'));
      if (movieId) {
        this.getMovieDetails(movieId);
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
        console.log(this.movie)
      },
      error: (err) => {
        this.error = 'Failed to load movie details: ' + err.message;
        this.loading = false;
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
    return languages.map(lang => lang.english_name || lang.name).join(', ');
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
}