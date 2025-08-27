import { Component, ViewChild } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { Movies, MoviesResponse } from '../../models/movies';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MovieDetailsComponent } from '../../shared/movie-details/movie-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageMovies: Movies[] = [];  
  listMovies: Movies[] = [];
  languages: string[] = [];
  filteredMovies: Movies[] = [];
  selectedLanguage: string = 'all';
  pageSize = 4;
  pageIndex = 0;

    constructor(private _moviesService: MoviesService, private dialog: MatDialog){}

  ngOnInit() {
    this._moviesService.getMoviesList().subscribe({
      next: (result) => {
        this.listMovies = result.results;
        this.applyFilter();
        this.languages = Array.from(
          new Set(this.listMovies.map(movie => movie.original_language))
        );
        //console.log("Datos de la pelicula ", this.listMovies);
      },
      error: (error) => {
        console.log("No se pudieron obtener los datos de la pelicula: ", error);
      }
    })

  }
  applyFilter() {
    if (this.selectedLanguage === 'all') {
      this.filteredMovies = this.listMovies;
    } else {
      this.filteredMovies = this.listMovies.filter(
        movie => movie.original_language === this.selectedLanguage
      );
    }
    this.pageIndex = 0;
    this.updatePageMovies();
  }



  search(word: string) {
    const q = word.trim().toLowerCase();
    this.pageMovies = this.listMovies.filter(m => m.title.toLowerCase().includes(q));
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
  }

  updatePageMovies(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pageMovies = this.filteredMovies.slice(start, end);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePageMovies();
  }

  openMovieDetails(id: number) {
    console.log("recibir id", id);
    this.dialog.open(MovieDetailsComponent, {
      data: id,       
      width: '800px',
      maxWidth: '90vw',
    });
    //console.log("Hola, esta es la tarjeta");
  }


}
