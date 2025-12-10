import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartService } from '../../cart.service';
import { LanguageSwitcherComponent } from '../../language-switcher/language-switcher.component'; // Importez le composant ici
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSwitcherComponent], // Ajoutez-le au tableau imports
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('badgeAnimation', [
      // Cette transition se déclenche à chaque fois que la valeur du trigger change
      transition('* => *', [
        style({ transform: 'scale(1.5)' }), // Agrandit le badge
        animate('300ms ease-out', style({ transform: 'scale(1)' })) // Le ramène à sa taille normale
      ])
    ])
  ]
})
export class NavbarComponent {
  isMobileMenuOpen = false;
  isScrolled = false; // Pour suivre l'état du défilement

  cartItemCount$: Observable<number>;

  constructor(
    private cartService: CartService
  ) {
    this.cartItemCount$ = this.cartService.items$.pipe(
      map(items => items.reduce((acc, item) => acc + item.quantity, 0))
    );
  }

  // Écoute l'événement de défilement sur la fenêtre
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    // Si le défilement vertical est supérieur à 10px, on passe isScrolled à true
    this.isScrolled = window.scrollY > 10;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}