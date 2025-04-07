import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component'; // <-- Import
import { WishlistComponent } from './components/wishlist/wishlist.component';


export const routes: Routes = [
  { path: '', component: HomeComponent }, // <-- Add default route
  // other routes...
  { path: '**', redirectTo: '' } ,// Optional: Redirect unknown paths to home
  { path: 'wishlist', component: WishlistComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
