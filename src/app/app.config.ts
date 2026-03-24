import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Fournit les routes à l'application
    provideRouter(routes),
    // Active le support des animations dans l'application
    provideAnimations(),
    // Fournit le client HTTP pour les appels API, avec le support de fetch
    provideHttpClient(withFetch())
  ]
};