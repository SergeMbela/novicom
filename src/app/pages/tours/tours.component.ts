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
  // Image par défaut ou celle survolée. J'utilise un placeholder.
  hoveredImage: string = 'https://placehold.co/600x400/f7a325/FFFFFF?text=Egypte';
  isImageFading: boolean = false;

  selectTab(tabName: string) {
    this.activeTab = tabName;
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
}
