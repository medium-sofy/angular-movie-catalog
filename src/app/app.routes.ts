import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component'; // <-- Import
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { WishlistCounterComponent } from './components/wishlist-counter/wishlist-counter.component';



export const routes: Routes = [
  { path: '', component: HomeComponent }, // <-- Add default route
  { path: 'wishlist', component: WishlistComponent },

  // other routes...
  { path: '**', redirectTo: '' } ,// Optional: Redirect unknown paths to home

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
