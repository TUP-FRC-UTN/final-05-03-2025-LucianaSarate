import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservasService } from '../../services/reservas.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-generar-reserva',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './generar-reserva.component.html',
  styleUrl: './generar-reserva.component.css'
})
export class GenerarReservaComponent implements OnInit {
  cities: any[] = [];
  availableServices: any[] = [];
  searchForm: FormGroup;
  reservaForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private reservasServices: ReservasService,
    private router: Router 
  ) {
    this.searchForm = this.fb.group({
      origen: ['', Validators.required],
      destino: ['', Validators.required],
      fecha: ['', Validators.required]
    });

    this.reservaForm = this.fb.group({
      document: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^[0-9]*$')]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      selectedService: ['', Validators.required],
      passengers: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadCities();
  }

  get passengers() {
    return this.reservaForm.get('passengers') as FormArray;
  }

  loadCities() {
    this.reservasServices.getCiudades().subscribe((data: any) => {
      this.cities = data;
      console.log('Ciudades cargadas:', this.cities);
    });
  }

  buscarServicios() {
    const { origen, destino, fecha } = this.searchForm.value;
    this.reservasServices.buscarServicios(origen, destino, fecha)
      .subscribe(services => {
        this.availableServices = services;
      });
  }

  agregarPasajero() {
    const pasajeroGroup = this.fb.group({
      document: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^[0-9]*$')]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]]
    });
    this.passengers.push(pasajeroGroup);
  }

  confirmarReserva() {
    if (this.reservaForm.valid) {
      const formValue = this.reservaForm.value;
      const reserva = {
        document: formValue.document,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        service: formValue.selectedService,
        passengers: [
          {
            document: formValue.document,
            firstName: formValue.firstName,
            lastName: formValue.lastName
          },
          ...formValue.passengers
        ],
        reservationCode: this.reservasServices.generarCodigoReserva(
          formValue.firstName,
          formValue.lastName,
          formValue.document
        )
      };
      
      this.reservasServices.postReserva(reserva).subscribe(
        response => {
          console.log('Reserva creada:', response);
          this.resetForms();
          this.router.navigate(['/lista']); 
        },
        error => console.error('Error:', error)
      );
    }
  }


  resetForms() {
    this.searchForm.reset();
    this.reservaForm.reset();
    this.passengers.clear();
    this.availableServices = [];
  }
}
