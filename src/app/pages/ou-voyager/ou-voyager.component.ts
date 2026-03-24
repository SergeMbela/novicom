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
      state('null', style({ backgroundColor: 'rgba(248, 249, 250, 0.9)' })), // A light default background
      // States for each continent
      state('afrique',  style({ backgroundColor: 'rgba(241, 196, 15, 0.75)' })),
      state('amerique', style({ backgroundColor: 'rgba(46, 204, 113, 0.75)' })),
      state('asie',     style({ backgroundColor: 'rgba(231, 76, 60, 0.75)' })),
      state('europe',   style({ backgroundColor: 'rgba(52, 152, 219, 0.75)' })),
      state('oceanie',  style({ backgroundColor: 'rgba(155, 89, 182, 0.75)' })),
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

  // List of all continents to display in the navigation.
  public allContinents: ContinentData[] = [];
  // Stream for the key of the selected continent, for styling the active button.
  public selectedContinentKey$: Observable<string | null>;

  // Subject to push user-selected sub-regions into a stream.
  private selectSubRegionAction = new Subject<SubRegionData>();
  
  constructor(
    @Inject(LOCALE_ID) private localeId: string,
    private continentService: ContinentSelectionService
  ) {
    // Get all continents for the navigation buttons
    this.allContinents = this.continentService.getContinents();

    // Set Europe as the default selection when the component is initialized.
    this.continentService.setSelection('europe');

    // 1. Base stream of continent data, shared to avoid multiple subscriptions to the source.
    this.continentData$ = this.continentService.selection$.pipe(
      shareReplay(1)
    );

    // Stream for the key of the selected continent, for styling the active button
    this.selectedContinentKey$ = this.continentData$.pipe(
      map(continent => continent?.key ?? null)
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

  // Determines the current language from the locale to display the correct name.
  public get currentLang(): 'fr' | 'en' {
    return this.localeId.startsWith('fr') ? 'fr' : 'en';
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

  /**
   * Sets the selected continent in the service when a user clicks a button.
   * @param key The key of the continent to select.
   */
  selectContinent(key: string): void {
    this.continentService.setSelection(key);
  }
}