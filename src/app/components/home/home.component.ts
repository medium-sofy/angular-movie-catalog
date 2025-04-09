// src/app/components/home/home.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Subscription, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    RouterLink,
    MovieCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'], // or .scss
})
export class HomeComponent implements OnInit, OnDestroy {
  movies: Movie[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  totalResults: number = 0;
  loading: boolean = false;
  error: string | null = null;
  searchQuery: string = '';
  isSearchMode: boolean = false;

  private searchTerms = new Subject<string>();
  private movieSubscription: Subscription | undefined;
  private searchSubscription: Subscription | undefined;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadMovies(this.currentPage);

    // Set up the search observable with debounce
    this.searchSubscription = this.searchTerms
      .pipe(
        debounceTime(500), // Wait for 500ms pause in events
        distinctUntilChanged(), // Only emit if value changed
        switchMap((term: string) => {
          this.isSearchMode = term.trim() !== '';
          this.loading = true;
          this.currentPage = 1; // Reset to first page on new search
          return term.trim()
            ? this.movieService.searchMovies(term, this.currentPage)
            : this.movieService.getMovies(this.currentPage);
        }),
      )
      .subscribe({
        next: (response: any) => {
          this.movies = response.results;
          this.totalPages = Math.min(response.total_pages, 500); // TMDB caps at 500
          this.totalResults = response.total_results;
          this.loading = false;
          window.scrollTo(0, 0);
        },
        error: (err) => {
          console.error('Error searching movies:', err);
          this.error = 'Failed to search movies. Please try again later.';
          this.loading = false;
        },
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.movieSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
  }

  loadMovies(page: number): void {
    if (this.loading) return; // Prevent multiple simultaneous requests

    this.loading = true;
    this.error = null; // Clear previous errors
    this.currentPage = page; // Update current page state
    // If in search mode, search movies with the current query
    // Otherwise, get the regular movie list
    const request = this.isSearchMode
      ? this.movieService.searchMovies(this.searchQuery, page)
      : this.movieService.getMovies(page);

    this.movieSubscription = this.movieService.getMovies(page).subscribe({
      next: (response) => {
        this.movies = response.results;
        this.totalPages = Math.min(response.total_pages, 500);
        this.totalResults = response.total_results;
        this.loading = false;
        window.scrollTo(0, 0);
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
        this.error = 'Failed to load movies. Please try again later.';
        this.loading = false;
      },
    });
  }
  
  // Trigger search when user types
   onSearchInput(): void {
     this.searchTerms.next(this.searchQuery);
   }
   
   // Clear search and return to default movie list
   clearSearch(): void {
     this.searchQuery = '';
     this.isSearchMode = false;
     this.loadMovies(1);
   }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.loadMovies(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadMovies(this.currentPage + 1);
    }
  }

  // Helper function to use in the template
  getPosterUrl(posterPath: string | null): string {
    const baseUrl = 'https://image.tmdb.org/t/p/w500'; // TMDB base URL for images
    return posterPath
      ? `${baseUrl}${posterPath}`
      : 'assets/images/placeholder.png';
  }

  handleImageError(event: Event): void {
    const element = event.target as HTMLImageElement;
    if (element) {
      // Set the path to your actual placeholder image
      element.src = 'assets/images/placeholder.png'; // Make sure this path is correct!
    }
  }
  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.loadMovies(1); // Reload all movies if the search query is empty
      return;
    }

    this.movies = this.movies.filter((movie) =>
      movie.title?.toLowerCase().includes(this.searchQuery.toLowerCase()),
    );
  }

  toggleWatchlist(movie: Movie): void {
    movie.inWatchlist = !movie.inWatchlist; // Toggle the watchlist status
    // TODO: Add logic here to PERSIST this change!
    // e.g., save the movie ID and its watchlist status to localStorage
    // or call a backend service. This toggle is currently only in memory
    // and will be lost on page reload or component re-initialization.
    console.log(
      `${movie.title} has been ${movie.inWatchlist ? 'added to' : 'removed from'} the watchlist.`,
    );
  }
}
