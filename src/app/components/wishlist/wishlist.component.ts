import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../services/wishlist.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faHeart as farHeart, faHeart as fasHeart, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faHeartBroken } from '@fortawesome/free-solid-svg-icons';

import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule,FaIconComponent],
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  @Input() movie: any;
  farHeart = farHeart;
  fasHeart = fasHeart;
  faTimes = faTimes;
  faHeartBroken = faHeartBroken;
  wishlistItems: any[] = [];

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.wishlistItems = this.wishlistService.getWishlistItems();
  }

  get isInWishlist(): boolean {
    return this.movie ? this.wishlistService.isInWishlist(this.movie.id) : false;
  }

  toggle(): void {
    this.wishlistService.toggleWishlist(this.movie);
    this.wishlistItems = this.wishlistService.getWishlistItems();
  }

  remove(id: number): void {
    this.wishlistService.removeFromWishlist(id);
    this.wishlistItems = this.wishlistService.getWishlistItems();
  }
}
