import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component'; // <-- Import
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { WishlistCounterComponent } from './components/wishlist-counter/wishlist-counter.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // <-- Add default route
  { path: 'movie/:id', component: MovieDetailsComponent },
  { path: 'wishlist', component: WishlistComponent },

  // other routes...
  { path: '**', component: PageNotFoundComponent } // Optional: Redirect unknown paths to home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
