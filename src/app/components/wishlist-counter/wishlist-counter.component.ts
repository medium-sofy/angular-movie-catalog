import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../services/wishlist.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  selector: 'app-wishlist-counter',
  templateUrl: './wishlist-counter.component.html',
  styleUrls: ['./wishlist-counter.component.css']
})
export class WishlistCounterComponent implements OnInit {
  faHeart = faHeart;
  count$!: Observable<number>;

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.count$ = this.wishlistService.getWishlistCount();
  }
}
