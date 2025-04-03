import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlightService } from '../../services/flight.service';
import { Route } from '../../models/route.model';
import { finalize } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss']
})
export class FlightSearchComponent implements OnInit {
  searchForm!: FormGroup;
  routes: Route[] = [];
  loading = false;
  error = '';
  noResults = false;
  currencies = ['USD', 'EUR', 'GBP', 'COP'];

  constructor(
    private fb: FormBuilder,
    private flightService: FlightService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      origin: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      destination: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      tripType: ['oneway', Validators.required],
      currency: ['USD', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.searchForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.noResults = false;
    this.routes = [];

    const { origin, destination, tripType, currency } = this.searchForm.value;

    const service = tripType === 'oneway' 
      ? this.flightService.getOneWayRoutes(origin, destination, currency)
      : this.flightService.getRoundTripRoutes(origin, destination, currency);

    service
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (data) => {
          this.routes = data;
          this.noResults = data.length === 0;
        },
        error: (err) => {
          this.error = 'Error al buscar vuelos. Por favor, inténtalo de nuevo.';
          console.error('Error fetching routes:', err);
        }
      });
  }

  // Helpers para validación de formularios
  get originControl() { return this.searchForm.get('origin'); }
  get destinationControl() { return this.searchForm.get('destination'); }
}
