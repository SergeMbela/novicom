import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { SupabaseService } from './services/supabase.service';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = async (route, state): Promise<boolean | UrlTree> => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // La vérification de session ne doit se faire que dans le navigateur
  if (isPlatformBrowser(platformId)) {
    const user = await supabaseService.getCurrentUser();
    if (user) {
      return true; // L'utilisateur est connecté, on autorise l'accès
    }
  }

  // L'utilisateur n'est pas connecté ou on est sur le serveur,
  // on le redirige vers la page de connexion.
  // On utilise createUrlTree pour une redirection propre gérée par le routeur.
  return router.createUrlTree(['/mon-compte']);
};