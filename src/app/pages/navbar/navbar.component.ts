import { Component, OnInit, OnDestroy, Inject, LOCALE_ID } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription, first } from 'rxjs';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ContinentSelectionService } from '../../services/continent-selection.service';

interface Continent {
  key: string;
  nameFr: string;
  nameEn: string;
  color: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  
  // Default to French, but this will be overridden in constructor
  selectedContinentDisplay: string = 'Où voyager'; 
  selectedContinentKey: string | null = null;
  hoveredContinentKey: string | null = null;
  
  // Determine if we are in English mode based on the build locale
  currentLang: 'fr' | 'en' = 'fr'; 

  private continentSelectionSubscription: Subscription | undefined;
  private urlSubscription: Subscription | undefined;

  continents: Continent[] = [
    { key: 'amerique', nameFr: 'Amérique', nameEn: 'America', color: 'oklch(45% 0.085 224.283)' },
    { key: 'afrique', nameFr: 'Afrique', nameEn: 'Africa', color: 'oklch(41.4% 0.112 45.904)' },
    { key: 'asie', nameFr: 'Asie', nameEn: 'Asia', color: 'oklch(80.8% 0.114 19.571)' },
    { key: 'europe', nameFr: 'Europe', nameEn: 'Europe', color: 'oklch(50% 0.134 242.749)' },
    { key: 'oceanie', nameFr: 'Océanie', nameEn: 'Oceania', color: 'oklch(60.6% 0.25 292.717)' },
  ];

  constructor(
    private router: Router,
    private continentSelectionService: ContinentSelectionService,
    private activatedRoute: ActivatedRoute,
    @Inject(LOCALE_ID) private localeId: string, // Inject the Angular Locale ID
    @Inject(DOCUMENT) private document: Document // Inject the document object
  ) {
    // Set initial language based on the Angular build locale.
    // This is a good fallback, but we'll rely on the URL for dynamic updates.
    this.currentLang = this.localeId.startsWith('en') ? 'en' : 'fr'; 
  }

  ngOnInit(): void {
    // Subscribe to URL changes to keep the current language updated.
    this.urlSubscription = this.activatedRoute.url.subscribe(urlSegments => {
      // The language is determined by the first segment of the URL (e.g., /en/home)
      this.currentLang = urlSegments[0]?.path === 'en' ? 'en' : 'fr';
      this.updateSelectedContinentDisplay(); // Update menu text when language changes
    });

    // Subscribe to continent selection changes from the service
    this.continentSelectionSubscription = this.continentSelectionService.currentSelection$.subscribe(selection => {
      this.selectedContinentKey = selection?.key || null;
      this.updateSelectedContinentDisplay();
    });
  }

  updateSelectedContinentDisplay(): void {
    const defaultText = this.currentLang === 'en' ? 'Where to travel' : 'Où voyager';

    if (this.selectedContinentKey) {
      const selected = this.continents.find(c => c.key === this.selectedContinentKey);
      if (selected) {
        this.selectedContinentDisplay = this.currentLang === 'en' ? selected.nameEn : selected.nameFr;
      } else {
        this.selectedContinentDisplay = defaultText;
      }
    } else {
      this.selectedContinentDisplay = defaultText;
    }
  }

  ngOnDestroy(): void {
    this.continentSelectionSubscription?.unsubscribe();
    this.urlSubscription?.unsubscribe();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  onContinentSelected(key: string, color: string): void {
    const continent = this.continents.find(c => c.key === key);
    if (continent) {
      // The service expects a 'name' property, so we provide the correct one based on the current language.
      const name = this.currentLang === 'en' ? continent.nameEn : continent.nameFr;
      this.continentSelectionService.changeSelection({ key, color, name });
      this.router.navigate(['/ou-voyager']);
      this.isMobileMenuOpen = false; // Close menu on selection
    }
  }

  onContinentHover(continent: Continent, isHovering: boolean): void {
    this.hoveredContinentKey = isHovering ? continent.key : null;
  }

  changeLanguage(targetLang: string): void {
    if (this.currentLang === targetLang) return; // Prevent unnecessary reload

    const currentPath = this.document.location.pathname;
    const currentSearch = this.document.location.search;

    // Reconstruct the path by removing the old locale prefix and adding the new one.
    // This is more robust than a simple string replacement.
    const pathWithoutLocale = currentPath.startsWith(`/${this.currentLang}`)
      ? currentPath.substring(this.currentLang.length + 1)
      : currentPath;

    // Force a full page reload to the new URL to load the correct language bundle.
    this.document.location.href = `/${targetLang}${pathWithoutLocale}${currentSearch}`;
  }
}