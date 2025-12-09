import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Définition de l'interface pour une destination
interface Destination {
  location: string;
  country: string;
  imageUrl: string;
  rating: number; // de 1 à 5
  days: number;
  price: number;
}
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
    { location: 'New York', country: 'États-Unis', imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1974', rating: 5, days: 7, price: 1600 },
    { location: 'Dubai', country: 'Émirats arabes unis', imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070', rating: 5, days: 6, price: 1400 },
    { location: 'Kyoto', country: 'Japon', imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070', rating: 5, days: 12, price: 2200 },
    { location: 'Rome', country: 'Italie', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1974', rating: 4, days: 7, price: 980 },
    { location: 'Rio de Janeiro', country: 'Brésil', imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070', rating: 4, days: 8, price: 1500 },
    { location: 'Parc de Banff', country: 'Canada', imageUrl: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=2070', rating: 5, days: 14, price: 1900 },
    { location: 'Santorin', country: 'Grèce', imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070', rating: 5, days: 7, price: 1350 },
    { location: 'Machu Picchu', country: 'Pérou', imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2070', rating: 5, days: 9, price: 1750 },
    { location: 'Amsterdam', country: 'Pays-Bas', imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=2070', rating: 4, days: 4, price: 700 },
  ];

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
}