import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { WishlistComponent } from './pages/wishlist/wishlist';
import { Popular } from './components/popular/popular';
import { TopRated } from './components/top-rated/top-rated';
import { UpComing } from './components/up-coming/up-coming';
import { Genres } from './components/genres/genres';
import { MoviesByGenres } from './components/movies-by-genres/movies-by-genres';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Login - MovieApp' },
  { path: 'register', component: RegisterComponent, title: 'Register - MovieApp' },
  { path: 'home', component: Home, title: 'Home - MovieApp' },
  { path: 'wishlist', component: WishlistComponent, title: 'My Wishlist - MovieApp' },
  {path:'popular',component:Popular,title:'Popular Movies'},
    {path:'TopRated',component:TopRated,title:'TopRated Movies'},
  {path:'upcoming',component:UpComing,title:'UpComing Movies'},
  {path:'genres',component:Genres,title:'Genres'},
   { path: 'genre/:id', component: MoviesByGenres, title: 'Movies by Genre' },

  // { path: 'movie:id', component: MovieDetailsComponent, title: 'Movie Details - MovieApp' },
  // { path: 'search', component: SearchComponent, title: 'Search - MovieApp' },
  // { path: 'register', component: RegisterComponent, title: 'Register - MovieApp' },
  // { path: 'account', component: AccountDetailsComponent, title: 'Account - MovieApp' },
  // { path: '**', component: NotFoundComponent, title: 'Page Not Found - MovieApp' }
];