import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject, switchMap, of, from, map, catchError, takeUntil, filter, tap } from 'rxjs';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';

import { environment } from '../../environments/environment';
import { CartService } from '../../services/cart.service'; // NOTE: Path updated to use the more complete, SSR-safe service.
import { CartItem } from '../../models/cart-item.model';
import { SupabaseService } from '../../services/supabase.service';
import { ConfirmationDialogComponent } from '../dialog/confirmation-dialog.component';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ConfirmationDialogComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  // Observable pour les articles du panier
  items$: Observable<CartItem[]>;
  // Observable pour le prix total
  totalPrice$: Observable<number>;
  // Propriété pour contrôler la visibilité de la boîte de dialogue
  showClearCartConfirmation = false;
  // Propriété pour vérifier si l'application s'exécute dans un navigateur
  isBrowser: boolean;

  isProcessingPayment = false;
  paymentErrorMessage: string | null = null;
  isPaymentElementLoading = false; // Gère l'état de chargement de l'élément de paiement
  paymentElementLoadingError = false; // Gère les erreurs de chargement de l'élément de paiement

  private stripe: Stripe | null = null;
  private elements: StripeElements | undefined;
  private destroy$ = new Subject<void>();
  private origin = '';

  constructor(
    private cartService: CartService,
    private supabaseService: SupabaseService,
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    // Détermine si le code s'exécute dans un environnement de navigateur
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // The service is the single source of truth for cart state.
    this.items$ = this.cartService.items$;
    // We use the total$ observable from the service to avoid duplicating logic.
    this.totalPrice$ = this.cartService.total$;
  }

async ngOnInit() {
    // Exécute le code lié à Stripe uniquement côté client
    if (this.isBrowser) {
      // Définit l'origine pour l'URL de retour, en toute sécurité côté client
      this.origin = window.location.origin;

      this.stripe = await loadStripe(environment.stripe_public_key);

      this.totalPrice$.pipe(
        filter(price => price > 0 && !!this.stripe),
        switchMap(price => {
          this.isPaymentElementLoading = true;
          this.paymentElementLoadingError = false;
          // First, get the session to ensure the user is authenticated
          return from(this.supabaseService.getSession()).pipe(
            map(sessionResponse => ({ price, sessionResponse }))
          );
        }),
        switchMap(({ price, sessionResponse }) => {
          const { data, error } = sessionResponse;
          if (error || !data.session) {
            console.error('Utilisateur non authentifié ou erreur de session. Redirection...', error);
            this.router.navigate(['/mon-compte']);
            return of(null); // Stop the stream for unauthenticated users
          }
          // Now create the payment intent with the session token
          return this.createPaymentIntent(price, data.session.access_token);
        }), // <--- ADDED COMMA HERE
        tap(clientSecret => {
          // Si aucun clientSecret n'est retourné, on désactive le chargement.
          // Cela se produit si l'utilisateur n'est pas authentifié ou si la création de l'intention de paiement échoue.
          if (!clientSecret) {
            this.isPaymentElementLoading = false;
          }
        }),
        filter((clientSecret): clientSecret is string => !!clientSecret),
        takeUntil(this.destroy$)
      ).subscribe(clientSecret => {
        if (this.stripe && !this.elements) {
          // 2. Initialiser les éléments Stripe avec le clientSecret
          this.elements = this.stripe.elements({ clientSecret, appearance: { theme: 'stripe' } });

          // 3. Créer et monter l'élément de paiement
          const paymentElement = this.elements.create('payment');
          paymentElement.mount('#payment-element');
          this.isPaymentElementLoading = false;
        }
      });
    }
  }

  private createPaymentIntent(price: number, accessToken: string): Observable<string | null> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'apikey': environment.supabaseKey
    });

    const amountInCents = Math.round(price * 100);
    const paymentIntentUrl = environment.stripe_lien_paiement;
    const body = { amount: amountInCents };

    return this.http.post<{ clientSecret: string }>(paymentIntentUrl, body, { headers }).pipe(
      map(response => response.clientSecret),
      catchError(error => {
        console.error('Erreur lors de la création du PaymentIntent :', error);
        this.paymentErrorMessage = 'Le chargement du formulaire de paiement a échoué. Veuillez rafraîchir la page ou réessayer plus tard.';
        this.isPaymentElementLoading = false;
        this.paymentElementLoadingError = true;
        return of(null);
      })
    );
  }

  async handlePaymentSubmit(event: Event) {
    event.preventDefault();

    if (this.isProcessingPayment) return;

    if (!this.stripe || !this.elements) {
      console.error('Stripe.js n\'a pas encore été chargé.');
      this.paymentErrorMessage = 'Le service de paiement n\'est pas prêt. Veuillez rafraîchir la page.';
      return;
    }

    this.isProcessingPayment = true;
    this.paymentErrorMessage = null;

    const { error } = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        // Assurez-vous que cette route existe dans votre app.routes.ts
        return_url: `${this.origin}/payment-success`,
      },
    });

    if (error) {
      this.paymentErrorMessage = error.message ?? 'Une erreur est survenue lors du paiement.';
      this.isProcessingPayment = false;
    }
  }

  // Appelle le service pour retirer un article du panier
  removeFromCart(index: number): void {
    this.cartService.removeFromCart(index);
  }

  // Appelle le service pour vider complètement le panier
  clearCart(): void {
    // Affiche simplement la boîte de dialogue personnalisée
    this.showClearCartConfirmation = true;
  }

  // Gère la confirmation de la suppression du panier
  onClearCartConfirm(): void {
    this.cartService.clearCart();
    this.showClearCartConfirmation = false; // Cache la boîte de dialogue
  }

  onClearCartCancel(): void {
    this.showClearCartConfirmation = false; // Cache la boîte de dialogue
  }

  // Appelle le service pour augmenter la quantité
  increaseQuantity(index: number): void {
    this.cartService.incrementQuantity(index);
  }

  // Appelle le service pour diminuer la quantité
  decreaseQuantity(index: number): void {
    this.cartService.decrementQuantity(index);
  }

  ngOnDestroy() {
    // This completes the destroy$ subject, which automatically unsubscribes
    // from any observables using the takeUntil(this.destroy$) operator.
    this.destroy$.next();
    this.destroy$.complete();
  }
}