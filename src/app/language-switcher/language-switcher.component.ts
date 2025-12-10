import { Component, Inject, LOCALE_ID } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lang-switcher">
      <ng-container *ngFor="let locale of supportedLocales">
        <!-- On utilise un lien avec (click) pour forcer un rechargement complet de la page -->
        <a *ngIf="locale.code !== activeLocale" (click)="changeLocale(locale.code)" [title]="locale.label" class="lang-option" style="cursor: pointer;">
          <span class="fi rounded-sm" [ngClass]="'fi-' + locale.flag"></span>
        </a>
        <!-- On affiche le drapeau de la langue active sans lien -->
        <span *ngIf="locale.code === activeLocale" class="lang-option active">
           <span class="fi rounded-sm" [ngClass]="'fi-' + locale.flag" [title]="locale.label"></span>
        </span>
      </ng-container>
    </div>
  `,
  styles: [`
    .lang-switcher {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
    .lang-option .fi {
      /* La librairie utilise font-size pour contrôler la taille. 1.2rem ~ 19.2px */
      font-size: 1.2rem; /* Taille réduite pour les drapeaux */
      /* La classe rounded-sm de Tailwind s'occupe du border-radius */
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      transition: transform 0.2s ease-in-out;
      display: block; /* Permet à la span d'avoir une taille et d'appliquer les transformations/ombres */
    }
    .lang-option:hover .fi {
      transform: scale(1.1);
    }
    .lang-option.active .fi {
      /* On utilise box-shadow pour simuler une bordure, ce qui fonctionne mieux sur les spans */
      box-shadow: 0 0 0 2px #007bff, 0 2px 5px rgba(0, 123, 255, 0.5);
    }
  `]
})
export class LanguageSwitcherComponent {
  // Définissez ici les langues que votre application supporte
  supportedLocales = [
    { code: 'fr', label: 'Français', flag: 'fr' },
    { code: 'en', label: 'English', flag: 'gb' } // 'gb' est souvent utilisé pour le drapeau du Royaume-Uni
  ];

  constructor(
    // Injecte l'identifiant de la langue actuelle (ex: 'fr')
    @Inject(LOCALE_ID) public activeLocale: string,
    // Injecte l'objet Document pour accéder à l'URL
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Construit le lien pour une langue donnée en conservant le chemin de la page actuelle.
   * @param localeCode Le code de la langue (ex: 'en')
   */
  buildLocaleLink(localeCode: string): string {
    const currentPath = this.document.location.pathname;

    // Si l'URL est /fr/contact, on extrait /contact
    const pathWithoutLocale = currentPath.startsWith(`/${this.activeLocale}`)
      ? currentPath.substring(this.activeLocale.length + 1)
      : currentPath;

    // On retourne la nouvelle URL complète, ex: /en/contact
    return `/${localeCode}${pathWithoutLocale}`;
  }

  /**
   * Change la langue de l'application en forçant un rechargement de la page.
   * @param localeCode Le code de la langue vers laquelle basculer.
   */
  changeLocale(localeCode: string): void {
    const newUrl = this.buildLocaleLink(localeCode);
    // On assigne la nouvelle URL à location.href pour forcer un rechargement complet de la page.
    // C'est nécessaire pour que Angular i18n charge la bonne version de l'application.
    this.document.location.href = newUrl;
  }
}
