import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesByGenres } from './movies-by-genres';

describe('MoviesByGenres', () => {
  let component: MoviesByGenres;
  let fixture: ComponentFixture<MoviesByGenres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesByGenres]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesByGenres);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
