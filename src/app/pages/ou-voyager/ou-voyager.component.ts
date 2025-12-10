import { Component, Inject, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, map, merge, shareReplay } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { SubRegionData, allSubRegionData } from './sub-region-data';
import { ContinentSelectionService, ContinentData } from '../../services/continent-selection.service';

@Component({
  selector: 'app-ou-voyager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ou-voyager.component.html',
  styleUrls: ['./ou-voyager.component.css'],
  animations: [
    trigger('colorChange', [
      // State for when no continent is selected
      state('null', style({ backgroundColor: '#f8f9fa' })), // A light default background
      // States for each continent
      state('afrique',  style({ backgroundColor: '#f1c40f' })),
      state('amerique', style({ backgroundColor: '#2ecc71' })),
      state('asie',     style({ backgroundColor: '#e74c3c' })),
      state('europe',   style({ backgroundColor: '#3498db' })),
      state('oceanie',  style({ backgroundColor: '#9b59b6' })),
      // Transition between any two states
      transition('* <=> *', [animate('0.7s ease-in-out')])
    ])
  ]
})
export class OuVoyagerComponent {
  // Observable stream of the selected continent data from the service.
  continentData$: Observable<ContinentData | null>;
  // Stream of sub-regions derived from the selected continent.
  subRegions$: Observable<SubRegionData[]>;
  // Stream of the currently selected sub-region.
  selectedSubRegion$: Observable<SubRegionData | null>;

  currentLang: 'fr' | 'en' = 'fr';

  // Subject to push user-selected sub-regions into a stream.
  private selectSubRegionAction = new Subject<SubRegionData>();
  
  constructor(
    @Inject(LOCALE_ID) private localeId: string,
    private continentService: ContinentSelectionService
  ) {
    this.currentLang = this.localeId.startsWith('en') ? 'en' : 'fr';

    // 1. Base stream of continent data, shared to avoid multiple subscriptions to the source.
    this.continentData$ = this.continentService.selection$.pipe(
      shareReplay(1)
    );

    // 2. Stream of available sub-regions, derived from the selected continent.
    this.subRegions$ = this.continentData$.pipe(
      map(continent => this.getSubRegionsForContinent(continent?.subRegionKeys ?? []))
    );

    // 3. Stream for the initially selected sub-region when the continent changes.
    // This emits the first sub-region from the list.
    const initialSubRegion$ = this.subRegions$.pipe(
      map(regions => (regions.length > 0 ? regions[0] : null))
    );

    // 4. The final selectedSubRegion$ stream merges the initial selection
    // with any subsequent user clicks, and shares the result.
    this.selectedSubRegion$ = merge(
      initialSubRegion$,
      this.selectSubRegionAction.asObservable()
    ).pipe(shareReplay(1));
  }

  private getSubRegionsForContinent(subRegionKeys: string[]): SubRegionData[] {
    if (subRegionKeys.length > 0) {
      // Filter out any keys that might not exist in allSubRegionData to prevent errors.
      return subRegionKeys.map(key => allSubRegionData[key]).filter(Boolean);
    }
    return [];
  }

  // Pushes the user's selection into the action stream.
  selectSubRegion(region: SubRegionData): void {
    this.selectSubRegionAction.next(region);
  }
}