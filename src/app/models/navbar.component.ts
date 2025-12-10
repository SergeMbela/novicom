import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CartService } from '../cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  cartItemCount$: Observable<number>;

  constructor(private cartService: CartService) {
    // On s'abonne à l'observable du panier et on transforme le tableau d'articles
    // en un nombre représentant la quantité d'articles.
    this.cartItemCount$ = this.cartService.items$.pipe(
      map(items => items.length)
    );
  }
}