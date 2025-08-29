import { Component, ViewChild } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { Movies } from '../../models/movies';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MovieDetailsComponent } from '../../shared/movie-details/movie-details.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchControl = new FormControl('');

  pageMovies: Movies[] = [];
  listMovies: Movies[] = [];
  searchResults: Movies[] = []; 
  filteredMovies: Movies[] = [];
  languages: string[] = [];
  selectedLanguage: string = 'all';
  pageSize = 4;
  pageIndex = 0;

  constructor(private _moviesService: MoviesService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this._moviesService.getMoviesList().subscribe({
      next: (result) => {
        this.listMovies = result.results;
        this.searchResults = this.listMovies; 
        this.languages = Array.from(new Set(this.listMovies.map(m => m.original_language)));
        this.applyFilter(); 
      },
      error: (error) => console.error("No se pudieron obtener los datos de la película:", error)
    });
  }

  search(query: string | null) {
    const term = (query ?? '').trim();

    if (!term) {
      this.searchResults = this.listMovies;
      this.applyFilter();
      return;
    }

    this._moviesService.searchMovies(term).subscribe({
      next: (result) => {
        const originalIds = new Set(this.listMovies.map(m => m.id));
        this.searchResults = result.results.filter(m => originalIds.has(m.id)); 
        this.applyFilter();
      },
      error: (error) => console.error("Error al buscar películas:", error)
    });
  }

  applyFilter() {
    if (!this.searchResults || this.searchResults.length === 0) {
      this.filteredMovies = [];
    } else if (this.selectedLanguage === 'all') {
      this.filteredMovies = this.searchResults;
    } else {
      this.filteredMovies = this.searchResults.filter(
        movie => movie.original_language === this.selectedLanguage
      );
    }
    this.pageIndex = 0;
    this.updatePageMovies();
  }

  onLanguageChange() {
    this.applyFilter();
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
  }

  updatePageMovies() {
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
    this.dialog.open(MovieDetailsComponent, {
      data: id,
      width: '800px',
      maxWidth: '90vw',
    });
  }

}
