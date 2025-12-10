import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Destination } from './destination.model';
import { CartItem } from './models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Clé pour le stockage local
  private readonly cartStorageKey = 'novicom_cart';

  // BehaviorSubject pour conserver l'état actuel du panier et notifier les observateurs
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  
  // Observable public pour que les composants puissent s'abonner aux changements du panier
  items$ = this.itemsSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  /**
   * Charge le panier depuis le localStorage au démarrage du service.
   * S'exécute uniquement côté client pour éviter les erreurs côté serveur (SSR).
   */
  private loadCartFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const storedCart = localStorage.getItem(this.cartStorageKey);
        if (storedCart) {
          this.itemsSubject.next(JSON.parse(storedCart));
        }
      } catch (e) {
        console.error('Erreur lors du chargement du panier depuis le localStorage', e);
        localStorage.removeItem(this.cartStorageKey); // Nettoie les données corrompues
      }
    }
  }

  private saveCartToStorage(items: CartItem[]): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.cartStorageKey, JSON.stringify(items));
    }
  }

  /**
   * Ajoute une destination au panier.
   * Si l'article existe déjà, sa quantité est incrémentée.
   * @param destination La destination à ajouter.
   */
  addToCart(destination: Destination) {
    const currentItems = this.itemsSubject.getValue();
    const existingItemIndex = currentItems.findIndex(item => item.destination.location === destination.location);

    if (existingItemIndex > -1) {
      // L'article existe déjà, on augmente la quantité
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + 1
      };
      this.itemsSubject.next(updatedItems);
      this.saveCartToStorage(updatedItems);
    } else {
      // Nouvel article, on l'ajoute avec une quantité de 1
      const newItem: CartItem = { destination: destination, quantity: 1 };
      this.itemsSubject.next([...currentItems, newItem]);
      this.saveCartToStorage([...currentItems, newItem]);
    }
    console.log(`"${destination.location}" a été ajouté/mis à jour dans le panier.`);
  }

  /**
   * Retire un article du panier à un index donné.
   * @param index L'index de l'article à retirer.
   */
  removeFromCart(index: number): void {
    const currentItems = this.itemsSubject.getValue();
    currentItems.splice(index, 1);
    this.itemsSubject.next([...currentItems]);
    this.saveCartToStorage(currentItems);
  }

  /**
   * Vide complètement le panier.
   */
  clearCart(): void {
    this.itemsSubject.next([]);
    this.saveCartToStorage([]);
  }

  /**
   * Augmente la quantité d'un article.
   * @param index L'index de l'article.
   */
  incrementQuantity(index: number): void {
    const currentItems = this.itemsSubject.getValue();
    if (currentItems[index]) {
      currentItems[index].quantity++;
      this.itemsSubject.next([...currentItems]);
      this.saveCartToStorage(currentItems);
    }
  }

  /**
   * Diminue la quantité d'un article.
   * Si la quantité atteint 0, l'article est retiré du panier.
   * @param index L'index de l'article.
   */
  decrementQuantity(index: number): void {
    const currentItems = this.itemsSubject.getValue();
    if (currentItems[index]) {
      currentItems[index].quantity--;
      if (currentItems[index].quantity <= 0) {
        this.removeFromCart(index);
      } else {
        this.itemsSubject.next([...currentItems]);
        this.saveCartToStorage(currentItems);
      }
    }
  }
}