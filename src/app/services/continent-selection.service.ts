import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ContinentData {
  key: string;
  name: { fr: string; en: string; };
  color: string;
  subRegionKeys: string[];
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContinentSelectionService {
  // BehaviorSubject qui stocke l'objet ContinentData complet ou null.
  // C'est plus simple et direct que d'encapsuler dans un autre objet.
  private readonly selectedContinentSource = new BehaviorSubject<ContinentData | null>(null);

  // Observable public auquel les composants peuvent s'abonner pour être notifiés des changements.
  public readonly selection$ = this.selectedContinentSource.asObservable();

  // La liste des continents est la source de vérité unique pour ces données dans l'application.
  private static readonly continents: ContinentData[] = [
    { 
      name: { fr: 'Europe', en: 'Europe' },   key: 'europe',   color: '#3498db',
      subRegionKeys: ['europe_west', 'europe_east', 'europe_north', 'europe_south'],
      imageUrl: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1950&q=80'
    },
    { 
      name: { fr: 'Asie', en: 'Asia' },       key: 'asie',     color: '#e74c3c', 
      subRegionKeys: ['asia_east', 'asia_south', 'asia_southeast', 'middle_east'],
      imageUrl: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&w=1950&q=80'
    },
    { 
      name: { fr: 'Afrique', en: 'Africa' },  key: 'afrique',  color: '#f1c40f', 
      subRegionKeys: ['africa_north', 'africa_east', 'africa_central', 'africa_west', 'africa_south'],
      imageUrl: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1950&q=80'
    },
    { 
      name: { fr: 'Amérique', en: 'America' }, key: 'amerique', color: '#2ecc71', 
      subRegionKeys: ['america_north', 'america_central', 'america_south'],
      imageUrl: 'https://images.unsplash.com/photo-1526749837599-b412b2c18b50?auto=format&fit=crop&w=1950&q=80'
    },
    { 
      name: { fr: 'Océanie', en: 'Oceania' },  key: 'oceanie',  color: '#9b59b6', 
      subRegionKeys: ['oceania_australia', 'oceania_melanesia', 'oceania_polynesia'],
      imageUrl: 'https://images.unsplash.com/photo-1507699622108-3a2723623592?auto=format&fit=crop&w=1950&q=80'
    }
  ];

  /**
   * Met à jour le continent actuellement sélectionné.
   * Trouve les données du continent par sa clé et les diffuse à tous les abonnés.
   * @param key La clé du continent à sélectionner (ex: 'europe'). Passer `null` pour effacer la sélection.
   */
  setSelection(key: string | null): void {
    const continentToSelect = ContinentSelectionService.continents.find(c => c.key === key) || null;
    this.selectedContinentSource.next(continentToSelect);
  }

  /**
   * Retourne la liste complète des continents.
   * Utile pour les composants qui doivent afficher toutes les options, comme la barre de navigation.
   */
  getContinents(): ContinentData[] {
    return ContinentSelectionService.continents;
  }
}