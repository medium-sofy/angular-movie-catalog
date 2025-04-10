import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import {
  Subscription,
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from "rxjs";
import { Movie } from "../../models/movie.model";
import { MovieService } from "../../services/movie.service";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { MovieCardComponent } from "../movie-card/movie-card.component";
import { WishlistService } from "../../services/wishlist.service";
import { LanguageService } from "../../services/language.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    RouterLink,
    MovieCardComponent,
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  movies: Movie[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  totalResults: number = 0;
  loading: boolean = false;
  error: string | null = null;
  searchQuery: string = "";
  isSearchMode: boolean = false;

  private searchTerms = new Subject<string>();
  private movieSubscription: Subscription | undefined;
  private searchSubscription: Subscription | undefined;
  private languageSubscription: Subscription | undefined;

  constructor(
    private movieService: MovieService,
    public wishlistService: WishlistService,
    private languageService: LanguageService,
  ) {}

  ngOnInit(): void {
    this.loadMovies(this.currentPage);

    // Set up the search observable with debounce
    this.searchSubscription = this.searchTerms
      .pipe(
        debounceTime(500), // Wait for 500ms pause in events
        distinctUntilChanged(), // Only emit if value changed
        switchMap((term: string) => {
          this.isSearchMode = term.trim() !== "";
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
          console.error("Error searching movies:", err);
          this.error = "Failed to search movies. Please try again later.";
          this.loading = false;
        },
      });

    this.languageSubscription = this.languageService.currentLanguage$.subscribe(
      () => {
        this.loadMovies(1);
      },
    );
  }

  ngOnDestroy(): void {
    this.movieSubscription?.unsubscribe();
    this.languageSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
  }

  loadMovies(page: number): void {
    if (this.loading) return;

    this.loading = true;
    this.error = null;
    this.currentPage = page;

    const currentLanguage = this.languageService.getCurrentLanguage();

    // If in search mode, search movies with the current query
    // Otherwise, get the regular movie list
    const request = this.isSearchMode
      ? this.movieService.searchMovies(this.searchQuery, page)
      : this.movieService.getMovies(page);

    this.movieSubscription = this.movieService
      .getMovies(page, currentLanguage)
      .subscribe({
        next: (response) => {
          this.movies = response.results.map((movie) => ({
            ...movie,
            inWatchlist: this.wishlistService.isInWishlist(movie.id),
          }));
          this.totalPages = response.total_pages;
          if (this.totalPages > 500) {
            this.totalPages = 500;
          }
          this.totalResults = response.total_results;
          this.loading = false;
          window.scrollTo(0, 0);
        },
        error: (err) => {
          console.error("Error fetching movies:", err);
          this.error = "Failed to load movies. Please try again later.";
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
    const baseUrl = "https://image.tmdb.org/t/p/w500"; // TMDB base URL for images
    return posterPath
      ? `${baseUrl}${posterPath}`
      : "assets/images/placeholder.png";
  }

  handleImageError(event: Event): void {
    const element = event.target as HTMLImageElement;
    if (element) {
      // Set the path to your actual placeholder image
      element.src = "assets/images/placeholder.png"; // Make sure this path is correct!
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
    this.wishlistService.toggleWishlist(movie);
    movie.inWatchlist = this.wishlistService.isInWishlist(movie.id);
  }
  isInWishlist(id: number): boolean {
    return this.wishlistService.isInWishlist(id);
  }
}
