// Définition de l'interface pour une destination
export interface Destination {
  location: string;
  country: string;
  description:string;
  imageUrl: string;
  rating: number; // de 1 à 5
  days: number;
  price: number;
}