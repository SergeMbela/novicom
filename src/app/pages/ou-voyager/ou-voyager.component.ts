import { Component, OnInit, OnDestroy, Inject, LOCALE_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ContinentSelectionService } from '../../services/continent-selection.service';
import { SubRegionData, allSubRegionData } from './sub-region-data';

@Component({
  selector: 'app-ou-voyager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ou-voyager.component.html',
  styleUrls: ['./ou-voyager.component.css']
})
export class OuVoyagerComponent implements OnInit, OnDestroy {
  continentSelectionne: string | null = null;
  couleurSelectionnee: string | null = null;
  subRegions: SubRegionData[] = [];
  selectedSubRegion: SubRegionData | null = null;
  private selectionSubscription: Subscription | undefined;
  currentLang: 'fr' | 'en' = 'fr';

  constructor(
    private continentSelectionService: ContinentSelectionService,
    @Inject(LOCALE_ID) private localeId: string
  ) {
    this.currentLang = this.localeId.startsWith('en') ? 'en' : 'fr';
  }

  ngOnInit(): void {
    this.selectionSubscription = this.continentSelectionService.currentSelection$.subscribe(selection => {
      if (!selection) return;

      this.continentSelectionne = selection.key;
      this.couleurSelectionnee = selection.color;

      // Réinitialiser les sous-régions à chaque changement de continent
      this.subRegions = [];
      this.selectedSubRegion = null;

      // Définir les sous-régions en fonction du continent sélectionné
      this.subRegions = this.getSubRegionsForContinent(this.continentSelectionne);

      // Sélectionner la première sous-région par défaut si elles existent
      if (this.subRegions.length > 0) {
        this.selectSubRegion(this.subRegions[0]);
      }
    });
  }

  private getSubRegionsForContinent(continentKey: string | null): SubRegionData[] {
    const subRegionKeys: { [key: string]: string[] } = {
      'afrique': ['Afrique du Nord', 'Afrique Australe', 'Afrique de l\'Ouest', 'Afrique de l\'Est', 'Afrique Centrale'],
      'amerique': ['Amérique du Nord', 'Amérique Centrale', 'Amérique du Sud'],
      'asie': ['Asie de l\'Est', 'Asie du Sud', 'Asie du Sud-Est', 'Moyen-Orient'],
      'oceanie': ['Australie', 'Mélanésie', 'Polynésie'],
      'europe': ['Europe occidentale', 'Europe de l\'Est', 'Europe du Nord', 'Europe du Sud']
    };

    if (continentKey && subRegionKeys[continentKey]) {
      return subRegionKeys[continentKey].map(key => allSubRegionData[key]);
    }
    return [];
  }

  selectSubRegion(region: SubRegionData): void {
    this.selectedSubRegion = region;
  }

  ngOnDestroy(): void {
    this.selectionSubscription?.unsubscribe();
  }
}