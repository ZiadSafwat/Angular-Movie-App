import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { WishlistComponent } from './pages/wishlist/wishlist';
import { Genres } from './components/genres/genres';
import { MoviesByGenres } from './components/movies-by-genres/movies-by-genres';
import { MovieDetails } from './components/movie-details/movie-details';
import { Search } from './components/search/search';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile';
import { ChangePassword } from './components/change-password/change-password';


export const routes: Routes = [
  { path: '', redirectTo: '/movies/now_playing', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Login - MovieApp' },
  { path: 'register', component: RegisterComponent, title: 'Register - MovieApp' },
  { path: 'profile', component: ProfileComponent },
  { path: 'change-password', component: ChangePassword },
  // Protected routes - require authentication
  { path: 'movies/:category', component: Home, title: 'Movies - MovieApp', canActivate: [authGuard] },
  { path: 'wishlist', component: WishlistComponent, title: 'My Wishlist - MovieApp', canActivate: [authGuard] },
  { path: 'genres', component: Genres, title: 'Genres', canActivate: [authGuard] },
  { path: 'genre/:id', component: MoviesByGenres, title: 'Movies by Genre', canActivate: [authGuard] },
  { path: 'movie/:id', component: MovieDetails, title: 'Movie Details - MovieApp', canActivate: [authGuard] },
  { path: 'search/:query', component: Search, title: 'Search - MovieApp', canActivate: [authGuard] },

  // { path: 'account', component: AccountDetailsComponent, title: 'Account - MovieApp', canActivate: [authGuard] },
  // { path: '**', component: NotFoundComponent, title: 'Page Not Found - MovieApp' }
];
