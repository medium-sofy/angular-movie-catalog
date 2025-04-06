import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component'; // <-- Import

export const routes: Routes = [
  { path: '', component: HomeComponent }, // <-- Add default route
  // other routes...
  { path: '**', redirectTo: '' } // Optional: Redirect unknown paths to home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }