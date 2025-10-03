import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { WishlistComponent } from './pages/wishlist/wishlist';


export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'wishlist', component: WishlistComponent, title: 'My Wishlist - MovieApp' },
  // { path: 'movie:id', component: MovieDetailsComponent, title: 'Movie Details - MovieApp' },
  // { path: 'search', component: SearchComponent, title: 'Search - MovieApp' },
  // { path: 'login', component: LoginComponent, title: 'Login - MovieApp' },
  // { path: 'register', component: RegisterComponent, title: 'Register - MovieApp' },
  // { path: 'account', component: AccountDetailsComponent, title: 'Account - MovieApp' },
  // { path: '**', component: NotFoundComponent, title: 'Page Not Found - MovieApp' }
];