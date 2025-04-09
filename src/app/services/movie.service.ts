// src/app/services/movie.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movie } from '../models/movie.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiUrl = environment.tmdb.apiUrl;
  private apiKey = environment.tmdb.apiKey;
  private imgBaseUrl = environment.tmdb.imgUrl;

  constructor(private http: HttpClient) {}

  /**
   * Gets a list of popular movies (or discover) from TMDB API with pagination.
   * @param page The page number to fetch.
   * @returns Observable<ApiResponse<Movie>>
   */
  getMovies(page: number = 1): Observable<ApiResponse<Movie>> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'en-US') // Optional: set language
      .set('sort_by', 'popularity.desc') // Optional: sort criteria
      .set('include_adult', 'false') // Optional: filter adult content
      .set('include_video', 'false') // Optional: filter videos
      .set('page', page.toString());

    // Using /discover/movie endpoint, you can add more filters like genres, etc.
    // Alternatively, use /movie/popular endpoint
    const url = `${this.apiUrl}/discover/movie`;
    // const url = `${this.apiUrl}/movie/popular`; // Alternative endpoint

    return this.http.get<ApiResponse<Movie>>(url, { params });
  }

  searchMovies(query: string, page: number = 1): Observable<ApiResponse<Movie>> {
     if (!query || query.trim() === '') {
       return this.getMovies(page); // Fall back to regular movie list if query is empty
     }
 
     const params = new HttpParams()
       .set('api_key', this.apiKey)
       .set('language', 'en-US')
       .set('query', query.trim())
       .set('include_adult', 'false')
       .set('page', page.toString());
 
     const url = `${this.apiUrl}/search/movie`;
     return this.http.get<ApiResponse<Movie>>(url, { params });
   }

  
  /**
   * Helper to construct the full image URL.
   * @param posterPath The poster_path from the API response.
   * @returns Full URL string or a placeholder/null if no path.
   */
   getMoviePosterUrl(posterPath: string | null): string {
      if (!posterPath) {
        return 'assets/images/placeholder.png';
      }
      return `${this.imgBaseUrl}${posterPath}`;
    }

  getMovieDetails(id: number) {
    const url = `${this.apiUrl}/movie/${id}`;
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'en-US');
    return this.http.get(url, { params });
  }
  
  getMovieRecommendations(id: number) {
    const url = `${this.apiUrl}/movie/${id}/recommendations`;
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'en-US');
    return this.http.get(url, { params });
  }
  
  getMovieReviews(id: number): Observable<any> {
    const url = `${this.apiUrl}/movie/${id}/reviews`;
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'en-US')
    
    return this.http.get(url, { params });
  }
}
