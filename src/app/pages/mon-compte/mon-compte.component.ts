import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service'; // Assurez-vous que le chemin est correct
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';

// Validateur personnalisé pour vérifier que deux champs correspondent
export function matchValidator(controlNameToMatch: string) {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlToMatch = control.parent?.get(controlNameToMatch);
    if (controlToMatch && controlToMatch.value !== control.value) {
      return { 'mismatch': true };
    }
    return null;
  };
}

@Component({
  selector: 'app-mon-compte',
  templateUrl: './mon-compte.component.html',
  styleUrls: ['./mon-compte.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class MonCompteComponent implements OnInit {
  activeTab: 'register' | 'login' = 'register';
  registerForm: FormGroup;
  loginForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentUser: User | null = null;
  private platformId = inject(PLATFORM_ID);

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    // --- Initialisation des formulaires ---
    this.registerForm = this.fb.group({
      gender: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      emailConfirm: ['', [Validators.required, Validators.email, matchValidator('email')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, matchValidator('password')]],
      phonePrefix: ['+33', Validators.required],
      phoneNumber: ['', Validators.required],
      newsletter: [false]
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async ngOnInit(): Promise<void> {
    // On vérifie si un utilisateur est déjà connecté (côté client uniquement)
    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = await this.supabaseService.getCurrentUser();
    }
  }

  setActiveTab(tab: 'register' | 'login') {
    this.activeTab = tab;
    this.errorMessage = null;
    this.successMessage = null;
  }

  async onSubmitRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched(); // Marque tous les champs comme "touchés" pour afficher les erreurs
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;
    const formValue = this.registerForm.value;

    try {
      const { data, error } = await this.supabaseService.signUp(formValue);

      if (error) {
        // C'est ici que nous gérons l'erreur d'e-mail dupliqué !
        if (error.message.includes('User already registered')) {
          this.errorMessage = 'Cette adresse e-mail est déjà utilisée. Veuillez vous connecter ou en utiliser une autre.';
        } else {
          this.errorMessage = `Erreur d'inscription : ${error.message}`;
        }
      } else {
        this.successMessage = 'Inscription réussie ! Veuillez vérifier votre boîte de réception pour confirmer votre adresse e-mail.';
        this.registerForm.reset();
      }
    } catch (error: any) {
      this.errorMessage = `Une erreur inattendue est survenue : ${error.message}`;
    } finally {
      this.loading = false;
    }
  }

  async onSubmitLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;
    const formValue = this.loginForm.value;

    try {
      const { data, error } = await this.supabaseService.signIn(formValue);

      if (error) {
        if (error.message === 'Invalid login credentials') {
          this.errorMessage = 'Adresse e-mail ou mot de passe incorrect.';
        } else {
          this.errorMessage = `Erreur de connexion : ${error.message}`;
        }
      } else {
        // Connexion réussie, on met à jour l'utilisateur courant pour afficher ses données
        this.currentUser = data.user;
      }
    } catch (error: any) {
      this.errorMessage = `Une erreur inattendue est survenue : ${error.message}`;
    } finally {
      this.loading = false;
    }
  }

  async handleSignOut() {
    await this.supabaseService.signOut();
    this.currentUser = null; // Met à jour la vue pour ré-afficher les formulaires
    this.router.navigate(['/']); // Optionnel : redirige vers l'accueil
  }
}