import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Movie } from '../models/movie.model'; 

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly STORAGE_KEY = 'movie_app_wishlist';
  private wishlistItems: Movie[] = [];
  private countSubject = new BehaviorSubject<number>(0);
  private wishlistSubject = new BehaviorSubject<Movie[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    this.wishlistItems = stored ? JSON.parse(stored) : [];
    this.updateCount();
    this.updateWishlist();
  }

  private updateCount(): void {
    this.countSubject.next(this.wishlistItems.length);
  }

  private updateWishlist(): void {
    this.wishlistSubject.next([...this.wishlistItems]);
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.wishlistItems));
    this.updateCount();
    this.updateWishlist();
  }

  toggleWishlist(movie: Movie): void {
    const index = this.wishlistItems.findIndex(item => item.id === movie.id);

    if (index > -1) {
      this.wishlistItems.splice(index, 1);
    } else {

      this.wishlistItems.push({...movie, inWatchlist: true});
    }

    this.saveToStorage();
  }

  isInWishlist(id: number): boolean {
    return this.wishlistItems.some(item => item.id === id);
  }

  getWishlistCount() {
    return this.countSubject.asObservable();
  }

  getWishlistItems() {
    return [...this.wishlistItems];
  }

  getWishlistUpdates() {
    return this.wishlistSubject.asObservable();
  }

  removeFromWishlist(id: number): void {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== id);
    this.saveToStorage();
  }
}