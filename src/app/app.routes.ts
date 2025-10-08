import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { WishlistComponent } from './pages/wishlist/wishlist';

import { Genres } from './components/genres/genres';
import { MoviesByGenres } from './components/movies-by-genres/movies-by-genres';
import { MovieDetails } from './components/movie-details/movie-details';
import { Search } from './components/search/search';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Login - MovieApp' },
  { path: 'register', component: RegisterComponent, title: 'Register - MovieApp' },

  { path: 'movies/:category', component: Home, title: 'Movies - MovieApp' },
  { path: 'home', redirectTo: '/movies/now_playing', pathMatch: 'full' },

  { path: 'wishlist', component: WishlistComponent, title: 'My Wishlist - MovieApp' },
  { path: 'genres', component: Genres, title: 'Genres' },
  { path: 'genre/:id', component: MoviesByGenres, title: 'Movies by Genre' },
  { path: 'movie/:id', component: MovieDetails, title: 'Movie Details - MovieApp' },
  { path: 'search/:query', component: Search, title: 'Search - MovieApp' },


  // { path: 'account', component: AccountDetailsComponent, title: 'Account - MovieApp' },
  // { path: '**', component: NotFoundComponent, title: 'Page Not Found - MovieApp' }
];