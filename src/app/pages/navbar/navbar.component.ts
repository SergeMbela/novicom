import { Component, HostListener, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { Observable } from 'rxjs';
import { map, filter, startWith, tap } from 'rxjs/operators';
import { CartService } from '../../cart.service';
import { ContinentSelectionService, ContinentData } from '../../services/continent-selection.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('badgeAnimation', [
      // Cette transition se déclenche à chaque fois que la valeur du trigger change
      transition('* => *', [
        style({ transform: 'scale(1.5)' }), // Agrandit le badge
        animate('300ms ease-out', style({ transform: 'scale(1)' })) // Le ramène à sa taille normale
      ])
    ])
  ]
})
export class NavbarComponent implements OnInit {
  isMobileMenuOpen = false;
  isScrolled = false; // Pour suivre l'état du défilement

  continents: ContinentData[] = [];
  selectedContinentKey: string = 'ou-voyager';
  selectedContinentDisplay: string = 'Où voyager';
  selectedContinentColor: string | null = null;
  hoveredContinentKey: string | null = null;
  currentLang: string; // 'fr' or 'en'
  currentLangKey: 'fr' | 'en';
  cartItemCount$: Observable<number>;

  constructor(
    private router: Router,
    @Inject(LOCALE_ID) public localeId: string,
    private cartService: CartService,
    private continentService: ContinentSelectionService
  ) {
    this.continents = this.continentService.getContinents();
    this.currentLang = this.localeId.split('-')[0];
    this.currentLangKey = this.currentLang as 'fr' | 'en';
    this.cartItemCount$ = this.cartService.items$.pipe(
      map(items => items.reduce((acc, item) => acc + item.quantity, 0))
    );
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(this.router.url), // Émet immédiatement l'URL actuelle
      map(() => this.router.url)
    ).subscribe(url => {
      const urlSegments = url.split('/');
      let continentKey: string | null = null;
      
      // Recherche l'index du segment 'ou-voyager' pour gérer les URLs avec ou sans préfixe de langue (ex: /fr/ou-voyager)
      const ouVoyagerIndex = urlSegments.indexOf('ou-voyager');
      if (ouVoyagerIndex > -1 && urlSegments.length > ouVoyagerIndex + 1 && urlSegments[ouVoyagerIndex + 1]) {
        continentKey = urlSegments[ouVoyagerIndex + 1];
      }

      if (continentKey) {
        const continent = this.continents.find(c => c.key === continentKey);
        if (continent) {
          this.selectedContinentKey = continent.key;
          this.selectedContinentDisplay = continent.name[this.currentLangKey];
          this.selectedContinentColor = continent.color;
          this.continentService.setSelection(continent.key); // Notifier le service du changement
        }
      } else {
        this.selectedContinentKey = 'ou-voyager';
        this.selectedContinentDisplay = this.currentLang === 'en' ? 'Where to travel' : 'Où voyager';
        this.selectedContinentColor = null;
        this.continentService.setSelection(null); // Notifier qu'aucun continent n'est sélectionné
      }
    });
  }

  // Écoute l'événement de défilement sur la fenêtre
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    // Si le défilement vertical est supérieur à 10px, on passe isScrolled à true
    this.isScrolled = window.scrollY > 10;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  onContinentHover(continent: any, isHovering: boolean): void {
    this.hoveredContinentKey = isHovering ? continent.key : null;
  }

  changeLanguage(lang: string): void {
    // Redirige vers la version linguistique correspondante du site
    window.location.href = `/${lang}`;
  }
}