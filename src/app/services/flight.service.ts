import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Route } from '../models/route.model';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  // URL base de la API
  private apiUrl = 'https://localhost:5001/api';

  constructor(private http: HttpClient) { }

  getOneWayRoutes(origin: string, destination: string, currency: string = 'USD'): Observable<Route[]> {
    let params = new HttpParams()
      .set('origin', origin)
      .set('destination', destination)
      .set('currency', currency);

    return this.http.get<Route[]>(`${this.apiUrl}/Routes/oneway`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getRoundTripRoutes(origin: string, destination: string, currency: string = 'USD'): Observable<Route[]> {
    let params = new HttpParams()
      .set('origin', origin)
      .set('destination', destination)
      .set('currency', currency);

    return this.http.get<Route[]>(`${this.apiUrl}/Routes/roundtrip`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}