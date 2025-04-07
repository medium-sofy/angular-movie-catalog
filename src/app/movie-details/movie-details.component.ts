import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-movie-details',
  imports: [],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent {
private movieId!: number;
private movie!: any;

constructor(private movieService: MovieService, private route: ActivatedRoute) {}

ngOnInit(): void {
  this.movieId = Number(this.route.snapshot.paramMap.get('id'));
  this.movieService.getMovieDetails(this.movieId).subscribe((movie : any) => {
    this.movie = movie;
    console.log(this.movie);
  });
}
}
