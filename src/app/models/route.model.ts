import { Flight } from './flight.model';

export interface Route {
  id: string;
  flights: Flight[];
  isRoundTrip: boolean;
  totalPrice: number;
  currency: string;
}