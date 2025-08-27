import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MoviesResponse, MovieDetails } from '../models/movies';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MoviesService { 
  private apiURL = 'https://api.themoviedb.org/3/movie/now_playing?page=1';
  private apiURLMovie = 'https://api.themoviedb.org/3/movie/'
  private headers = new HttpHeaders({
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjAyNGFkNzBjODAyZmE5NjExYjA0NjFhOThhMjFlOCIsIm5iZiI6MTc1NjE2MDI5My41LCJzdWIiOiI2OGFjZTEyNTYxNmMzZDJjYTg2Y2VlZGUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.k1b0n0bZR0XObS7WQc3GPJ4fJffje1CzsRe8AUMFdhs'
  });

  constructor(private http: HttpClient) { }
   

  getMoviesList(): Observable<MoviesResponse>{
    return this.http.get<MoviesResponse>(this.apiURL, { headers: this.headers });
  }

  getMovie(id: number): Observable<MovieDetails>{
    return this.http.get<MovieDetails>(`${this.apiURLMovie}${id}`, { headers: this.headers });
  }

}
