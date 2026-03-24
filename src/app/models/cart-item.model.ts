import { Destination } from "../destination.model";

export interface CartItem {
  destination: Destination;
  quantity: number;
}