import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MoviesService } from '../../services/movies.service';
import { MovieDetails } from '../../models/movies';

@Component({
  selector: 'app-movie-details',
  standalone: false,
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent {

  moviesDetails: MovieDetails = {};

  constructor(private _moviesService:MoviesService, public dialogRef: MatDialogRef<MovieDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) {}

  ngOnInit(){
    console.log("id", this.data);
    this._moviesService.getMovie(this.data).subscribe({
        next: (result) => {
          this.moviesDetails = result;
          //console.log("Detalles de la pelicula", this.moviesDetails);
        },
        error: (error) =>{
          console.log("No se pudieron obtener los datos de la pelicula: ", error);
        }
      })
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
