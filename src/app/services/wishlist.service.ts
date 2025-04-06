import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly STORAGE_KEY = 'movie_app_wishlist';
  private wishlistItems: any[] = [];
  private countSubject = new BehaviorSubject<number>(0);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    this.wishlistItems = stored ? JSON.parse(stored) : [];
    this.updateCount();
  }

  private updateCount(): void {
    this.countSubject.next(this.wishlistItems.length);
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.wishlistItems));
    this.updateCount();
  }

  toggleWishlist(movie: any): void {
    const index = this.wishlistItems.findIndex(item => item.id === movie.id);

    if (index > -1) {
      this.wishlistItems.splice(index, 1);
    } else {
      this.wishlistItems.push(movie);
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

  removeFromWishlist(id: number): void {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== id);
    this.saveToStorage();
  }
}
