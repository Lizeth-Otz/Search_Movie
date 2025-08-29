import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { HomeComponent } from './home.component';
import { MoviesService } from '../../services/movies.service';
import { MoviesResponse } from '../../models/movies';
import { By } from '@angular/platform-browser';

describe('HomeComponent con mock de servicio y CUSTOM_ELEMENTS_SCHEMA', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockService: jasmine.SpyObj<MoviesService>; //mock del servicio real
  const fakeMovies: MoviesResponse = {
      page: 1,
      total_pages: 1,
      total_results: 2,
      results: [
        {
          id: 1,
          title: 'Película Mock 1',
          adult: false,
          backdrop_path: '',
          genre_ids: [1],
          original_language: 'en',
          original_title: 'Mock Movie 1',
          overview: 'Una película de prueba 1',
          popularity: 10,
          poster_path: '',
          release_date: new Date(),
          video: false,
          vote_average: 8,
          vote_count: 100
        },
        {
          id: 2,
          title: 'Película Mock 2',
          adult: false,
          backdrop_path: '',
          genre_ids: [2],
          original_language: 'en',
          original_title: 'Mock Movie 2',
          overview: 'Una película de prueba 2',
          popularity: 20,
          poster_path: '',
          release_date: new Date(),
          video: false,
          vote_average: 7,
          vote_count: 50
        }
      ]
    };

  beforeEach(async () => {
    // Creamos un "spy" (mock) del servicio MoviesService
    // que tiene un método getMoviesList simulado
    mockService = jasmine.createSpyObj('MoviesService', ['getMoviesList']);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent], // declaramos el componente a probar
      providers: [
        { provide: MoviesService, useValue: mockService } // inyectamos el mock en vez del real
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] //ignoramos tags de Angular Material que no importamos (ej. mat-card, mat-form-field)
    }).compileComponents();

    // creamos el fixture (entorno de pruebas del componente)
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance; // instancia del componente
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy(); // simplemente valida que existe
  });

  it('debería cargar películas desde el servicio mock', () => {
    // cuando alguien llame a getMoviesList en el componente,
    // devolvemos nuestro fakeMovies como observable
    mockService.getMoviesList.and.returnValue(of(fakeMovies));

    // ejecutamos el ciclo de vida ngOnInit manualmente
    component.ngOnInit();

    // validamos que los datos llegaron correctamente al componente
    expect(component.listMovies.length).toBe(2);
    expect(component.listMovies[0].title).toBe('Película Mock 1');
    expect(component.listMovies[1].title).toBe('Película Mock 2');

    // validamos que efectivamente se llamó al servicio
    expect(mockService.getMoviesList).toHaveBeenCalled();
  });

  it('debería renderizar los títulos en el template', () => {
    // volvemos a mockear la respuesta
    mockService.getMoviesList.and.returnValue(of(fakeMovies));

    // fixture.detectChanges() ejecuta:
    // 1. ngOnInit()
    // 2. detección de cambios → actualiza el template
    fixture.detectChanges();

    // buscamos en el HTML los elementos <h3> dentro de <mat-card>
    const cards = fixture.debugElement.queryAll(By.css('mat-card h3'));

    // esperamos que haya 2 tarjetas
    expect(cards.length).toBe(2);

    // y que contengan los títulos mock
    expect(cards[0].nativeElement.textContent).toContain('Película Mock 1');
    expect(cards[1].nativeElement.textContent).toContain('Película Mock 2');
  });  
});






// import { TestBed } from '@angular/core/testing';
// import { MoviesService } from '../../services/movies.service';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// describe('MoviesService', () => {
//   let service: MoviesService;
//   let httpMock: HttpTestingController;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [MoviesService]
//     });

//     service = TestBed.inject(MoviesService);
//     httpMock = TestBed.inject(HttpTestingController);
//   });

//   afterEach(() => {
//     httpMock.verify(); // asegura que no queden requests pendientes
//   });

//   it('debería hacer GET a la API y devolver MoviesResponse', () => {
//     const fakeResponse = {
//       page: 1,
//       results: [
//         {
//           adult: false,
//           backdrop_path: '/path.jpg',
//           genre_ids: [28, 12],
//           id: 1,
//           original_language: 'en',
//           original_title: 'Fake Movie',
//           overview: 'Overview de prueba',
//           popularity: 10,
//           poster_path: '/poster.jpg',
//           release_date: new Date('2023-01-01'),
//           title: 'Fake Movie',
//           video: false,
//           vote_average: 7.5,
//           vote_count: 100
//         }
//       ],
//       total_pages: 1,
//       total_results: 1
//     };

//     service.getMoviesList().subscribe(response => {
//       expect(response).toEqual(fakeResponse);
//     });

//     const req = httpMock.expectOne(service['apiURL']); // verifica que se llamó a la URL correcta
//     expect(req.request.method).toBe('GET');
//     req.flush(fakeResponse); // devuelve la respuesta simulada
//   });
// });
