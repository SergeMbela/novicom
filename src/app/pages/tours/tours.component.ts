import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tours',
  imports: [CommonModule],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.css'
})
export class ToursComponent {
  activeTab: string = 'Afrique';
  // Image par défaut pour l'onglet Afrique (premier tour).
  hoveredImage: string = 'https://images.unsplash.com/photo-1569097426112-48c5c450519d?q=80&w=1974&auto=format&fit=crop';
  isImageFading: boolean = false;
  placeholderImage: string = 'https://placehold.co/600x400/cccccc/FFFFFF?text=Image+Indisponible';

  selectTab(tabName: string) {
    this.activeTab = tabName;
    // TODO: Mettre à jour l'image par défaut lors du changement d'onglet pour correspondre au premier tour de l'onglet sélectionné.
  }

  // Met à jour l'image au survol avec un effet de fondu
  setHoveredImage(imageUrl: string): void {
    if (this.hoveredImage === imageUrl) return;

    this.isImageFading = true; // Déclenche le fondu sortant (opacity-0)

    // Attend la fin de la transition avant de changer l'image
    setTimeout(() => {
      this.hoveredImage = imageUrl;
      this.isImageFading = false; // Déclenche le fondu entrant (opacity-100)
    }, 300); // La durée doit correspondre à la durée de la transition CSS
  }

  // Gère les erreurs de chargement d'image en affichant une image de remplacement.
  handleImageError(event: Event) {
    const element = event.target as HTMLImageElement;
    element.src = this.placeholderImage;
    element.onerror = null; // Évite les boucles d'erreurs si le placeholder est aussi cassé.
  }
}
