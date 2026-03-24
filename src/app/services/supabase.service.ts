import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { createClient, SupabaseClient, AuthError, User, Session } from '@supabase/supabase-js';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment';

// Interface pour typer les données du formulaire (Bonne pratique)
export interface SignUpForm {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  gender: string;
  phonePrefix: string;
  phoneNumber: string;
  newsletter: boolean;
}

// Interface pour le formulaire de connexion
export interface SignInForm {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      // Côté client, on initialise Supabase normalement, il utilisera localStorage.
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    } else {
      // Côté serveur (SSR), on doit fournir un adaptateur de stockage "noop" (qui ne fait rien)
      // pour empêcher Supabase de tenter d'accéder à `localStorage`, qui n'existe pas dans Node.js.
      const noopStorage = {
        getItem: (_key: string) => null,
        setItem: (_key: string, _value: string) => {},
        removeItem: (_key: string) => {},
      };

      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
        auth: {
          storage: noopStorage,
          autoRefreshToken: false,
          persistSession: false
        }
      });
    }
  }

  /**
   * Inscrit un nouvel utilisateur.
   * @param formData Les données du formulaire d'inscription.
   * @returns Une promesse avec les données de l'utilisateur ou une erreur.
   */
  async signUp(formData: SignUpForm): Promise<{ data: { user: User | null; session: Session | null }, error: AuthError | null }> {
    const { data, error } = await this.supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstname,
          last_name: formData.lastname,
          gender: formData.gender,
          phone_number: `${formData.phonePrefix}${formData.phoneNumber}`,
          // OPTIMISATION : On ajoute la préférence newsletter ici directement.
          // Cela évite une deuxième requête et les problèmes de droits (RLS) si l'email n'est pas encore confirmé.
          newsletter_subscription: formData.newsletter
        },
      }
    }); // <--- CORRECTION ICI : Il manquait la parenthèse fermante ')'

    // Note : Grâce à l'optimisation ci-dessus, l'appel à updateProfile n'est plus nécessaire ici.
    // Les données sont stockées dans 'raw_user_meta_data' et peuvent être copiées dans la table 'profiles' via un Trigger SQL.

    return { data, error };
  }

  /**
   * Connecte un utilisateur existant.
   * @param formData Les données du formulaire de connexion.
   * @returns Une promesse avec les données de l'utilisateur ou une erreur.
   */
  async signIn(formData: SignInForm): Promise<{ data: { user: User | null; session: Session | null }, error: AuthError | null }> {
    return this.supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
  }

  /**
   * Récupère l'utilisateur actuellement connecté à partir de la session.
   * @returns Une promesse qui se résout avec l'objet User ou null.
   */
  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error.message);
      return null;
    }
    return data.user;
  }

  /**
   * Récupère la session en cours.
   * @returns Une promesse qui se résout avec les données de la session ou une erreur.
   */
  async getSession(): Promise<{ data: { session: Session | null }, error: AuthError | null }> {
    return this.supabase.auth.getSession();
  }

  /**
   * Déconnecte l'utilisateur actuel.
   * @returns Une promesse qui se résout avec une erreur si la déconnexion échoue.
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    return this.supabase.auth.signOut();
  }

  /**
   * Met à jour le profil d'un utilisateur.
   * @param userId L'ID de l'utilisateur à mettre à jour.
   * @param profileData Les données à mettre à jour.
   */
  private async updateProfile(userId: string, profileData: { [key: string]: any }) {
    const { error } = await this.supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId);

    if (error) {
      console.error('Erreur lors de la mise à jour du profil :', error);
    }
  }
}