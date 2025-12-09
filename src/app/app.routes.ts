import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { BienvenueComponent } from './pages/bienvenue/bienvenue.component';
import { OuVoyagerComponent } from './pages/ou-voyager/ou-voyager.component';
import { VoyageMystereComponent } from './pages/voyage-mystere/voyage-mystere.component';
import { ToursComponent } from './pages/tours/tours.component';
import { CroisieresComponent } from './pages/croisieres/croisieres.component';
import { MonCompteComponent } from './pages/mon-compte/mon-compte.component';

export const routes: Routes = [
  // Default routes for the source locale (fr)
  { path: '', component: HomeComponent },
  { path: 'bienvenue', component: BienvenueComponent },
  { path: 'ou-voyager', component: OuVoyagerComponent },
  { path: 'voyage-mystere', component: VoyageMystereComponent },
  { path: 'tours', component: ToursComponent },
  { path: 'croisieres', component: CroisieresComponent },
  { path: 'mon-compte', component: MonCompteComponent },

  // Routes for the 'en' locale (prefixed)
  // Angular i18n routing automatically handles this prefixing during build/serve
  // So, we don't need to explicitly define '/en/home', '/en/bienvenue', etc. here.
  // The `localize` option in angular.json handles the URL prefixing.
  // However, if we want to manually handle it for some reason, we could.
  // But the standard Angular i18n setup means the routes array remains the same.
  // The `changeLanguage` function will simply redirect to the correct base URL.


  // Redirection vers l'accueil si la route n'existe pas
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
