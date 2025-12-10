import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Destination } from '../models/destination.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root' // Le service est disponible dans toute l'application
})
export class CartService {
  private readonly cartStorageKey = 'novicom_cart';

  // BehaviorSubject pour conserver l'état actuel du panier et notifier les observateurs
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  
  // Observable public pour que les composants puissent s'abonner aux changements du panier
  items$ = this.itemsSubject.asObservable();
  
  // Observable public pour le total du panier, dérivé de items$
  total$: Observable<number>;

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Calcule le total à chaque mise à jour du panier
    // Note : Assurez-vous que votre modèle Destination a bien une propriété 'price'.
    this.total$ = this.items$.pipe(
      map(items => items.reduce((acc, item) => acc + (item.destination.price * item.quantity), 0))
    );

    this.loadCartFromLocalStorage();
  }

  // Ajoute une destination au panier
  addToCart(destination: Destination) {
    // Récupère la valeur actuelle du panier
    const currentItems = [...this.itemsSubject.getValue()];
    // Cherche si l'article existe déjà (en se basant sur un identifiant unique, ici location)
    const existingItemIndex = currentItems.findIndex(item => item.destination.location === destination.location);

    if (existingItemIndex > -1) {
      // Si l'article existe, on incrémente sa quantité
      currentItems[existingItemIndex].quantity++;
    } else {
      // Sinon, on l'ajoute au panier avec une quantité de 1
      currentItems.push({ destination: destination, quantity: 1 });
    }

    this.itemsSubject.next(currentItems);
    this.saveCartToLocalStorage(currentItems);
    console.log(`'${destination.location}' a été ajouté au panier.`);
  }

  // Supprime une destination du panier par son index
  removeFromCart(index: number) {
    const currentItems = this.itemsSubject.getValue();
    // Vérifie si l'index est valide avant de tenter de supprimer
    if (index >= 0 && index < currentItems.length) {
      const updatedItems = [...currentItems]; // Crée une copie superficielle pour éviter la mutation directe
      updatedItems.splice(index, 1); // Supprime l'élément à l'index spécifié
      this.itemsSubject.next(updatedItems); // Émet la nouvelle liste d'articles
      this.saveCartToLocalStorage(updatedItems);
      console.log(`L'article à l'index ${index} a été retiré du panier.`);
    } else {
      console.warn(`Tentative de retirer un article avec un index invalide: ${index}`);
    }
  }

  // Incrémente la quantité d'un article
  incrementQuantity(index: number): void {
    const currentItems = [...this.itemsSubject.getValue()];
    if (index >= 0 && index < currentItems.length) {
      currentItems[index].quantity++;
      this.itemsSubject.next(currentItems);
      this.saveCartToLocalStorage(currentItems);
    }
  }

  // Décrémente la quantité d'un article
  decrementQuantity(index: number): void {
    const currentItems = [...this.itemsSubject.getValue()];
    if (index >= 0 && index < currentItems.length) {
      currentItems[index].quantity--;
      if (currentItems[index].quantity <= 0) {
        // Si la quantité est 0 ou moins, on retire l'article
        currentItems.splice(index, 1);
      }
      this.itemsSubject.next(currentItems);
      this.saveCartToLocalStorage(currentItems);
    }
  }

  // Vide complètement le panier
  clearCart(): void {
    this.itemsSubject.next([]); // Émet un tableau vide pour notifier tous les abonnés
    if (this.isBrowser) {
      localStorage.removeItem(this.cartStorageKey); // Supprime les données du localStorage
    }
    console.log('Le panier a été vidé.');
  }

  // Sauvegarde le panier dans le localStorage
  private saveCartToLocalStorage(items: CartItem[]): void {
    if (this.isBrowser) {
      localStorage.setItem(this.cartStorageKey, JSON.stringify(items));
    }
  }

  // Charge le panier depuis le localStorage
  private loadCartFromLocalStorage(): void {
    if (this.isBrowser) {
      const savedCart = localStorage.getItem(this.cartStorageKey);
      if (savedCart) {
        this.itemsSubject.next(JSON.parse(savedCart));
      }
    }
  }
}
