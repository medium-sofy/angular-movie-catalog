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
   movieId!: number;
   movie!: any;

  constructor(private movieService: MovieService, private route: ActivatedRoute) { }
  getPosterUrl(path:string): string {
    return `https://image.tmdb.org/t/p/w500/${path}`;
  }
  ngOnInit() {
    this.movieId = Number(this.route.snapshot.paramMap.get('id'));
    this.movieService.getMovieDetails(this.movieId).subscribe((movie: any) => {
      this.movie = movie;
      console.log(this.movie);
    });
  }
  
  getLanguagesList(languages: any[]): string {
    if (!languages || languages.length === 0) {
      return '';
    }
    return languages.map(lang => lang.english_name || lang.name).join(', ');
  }
}