import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component'; // <-- Import
import { MovieDetailsComponent } from './movie-details/movie-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // <-- Add default route
  { path: 'movie/:id', component: MovieDetailsComponent },
  // other routes...
  { path: '**', redirectTo: '' } // Optional: Redirect unknown paths to home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }