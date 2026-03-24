import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Destination } from './destination.model';
import { CartService } from './cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Terme de recherche lié à l'input
  searchTerm: string = '';
  // Liste des destinations filtrées à afficher
  filteredDestinations: Destination[] = [];
  // Tableau complet des destinations
  destinations: Destination[] = [
    { location: 'New York', country: 'États-Unis', description: 'Explorez la ville qui ne dort jamais, de Times Square à Central Park. Une aventure urbaine inoubliable.', imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1974', rating: 5, days: 7, price: 1600 },
    { location: 'Dubai', country: 'Émirats arabes unis', description: 'Découvrez le luxe et la modernité au cœur du désert. Des gratte-ciels futuristes aux souks traditionnels.', imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070', rating: 5, days: 6, price: 1400 },
    { location: 'Kyoto', country: 'Japon', description: 'Plongez dans l\'histoire du Japon impérial. Visitez des temples sereins et des jardins zen magnifiques.', imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070', rating: 5, days: 12, price: 2200 },
    { location: 'Rome', country: 'Italie', description: 'Marchez sur les traces des empereurs. La Ville Éternelle vous dévoile ses trésors antiques et sa dolce vita.', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1974', rating: 4, days: 7, price: 980 },
    { location: 'Rio de Janeiro', country: 'Brésil', description: 'Vibrez au rythme de la samba entre plages mythiques et montagnes luxuriantes, sous l\'œil du Christ Rédempteur.', imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070', rating: 4, days: 8, price: 1500 },
    { location: 'Parc de Banff', country: 'Canada', description: 'Admirez des paysages à couper le souffle. Lacs turquoise, montagnes majestueuses et faune sauvage vous attendent.', imageUrl: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=2070', rating: 5, days: 14, price: 1900 },
    { location: 'Santorin', country: 'Grèce', description: 'Contemplez des couchers de soleil légendaires depuis des villages blancs perchés sur des falaises volcaniques.', imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070', rating: 5, days: 7, price: 1350 },
    { location: 'Machu Picchu', country: 'Pérou', description: 'Partez à la découverte de la mystérieuse cité inca, nichée au sommet des Andes. Une merveille du monde.', imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2070', rating: 5, days: 9, price: 1750 },
    { location: 'Amsterdam', country: 'Pays-Bas', description: 'Flânez le long des canaux pittoresques et découvrez une ville riche en art, en histoire et en culture.', imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=2070', rating: 4, days: 4, price: 700 },
  ];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Au démarrage, on affiche toutes les destinations
    this.filteredDestinations = this.destinations;
  }

  // Fonction pour filtrer les destinations
  filterDestinations(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredDestinations = this.destinations.filter(dest =>
      dest.location.toLowerCase().includes(term) ||
      dest.country.toLowerCase().includes(term)
    );
  }

  // Fonction pour générer un tableau pour les étoiles pleines
  getFilledStars(rating: number): any[] {
    return Array(Math.floor(rating));
  }

  // Fonction pour générer un tableau pour les étoiles vides
  getEmptyStars(rating: number): any[] {
    return Array(5 - Math.floor(rating));
  }

  // Fonction appelée lors du clic sur le bouton "Commander"
  order(destination: Destination): void {
    // Pour l'instant, affiche simplement la commande dans la console.
    // Plus tard, vous pourriez implémenter une redirection ou une modale de confirmation.
    console.log(`Commande passée pour : ${destination.location}`);
  }

  // Fonction pour ajouter une destination au panier
  addToCart(destination: Destination): void {
    this.cartService.addToCart(destination);
  }
}