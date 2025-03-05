import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservasService } from '../../services/reservas.service';

@Component({
  selector: 'app-lista-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-reservas.component.html',
  styleUrl: './lista-reservas.component.css'
}) 
export class ListaReservasComponent implements OnInit {
  reservas: any = [];
  pasajerosList: any[] = [];  
  services: any = [];
  
  constructor(private reservaServices: ReservasService) { }

  ngOnInit(): void {
    this.reservaServices.getReservas().subscribe(
      (reservas: any) => {
        this.reservas = reservas;
        this.procesarPasajeros();
        console.log('Pasajeros procesados:', this.pasajerosList);
      },
      error => {
        console.error('Error al cargar reservas:', error);
      }
    );
    this.reservaServices.getServices().subscribe(
      (servicios: any) => {
        this.services = servicios;
        // Una vez que tenemos los servicios, obtenemos las reservas
      },
      error => {
        console.error('Error al cargar servicios:', error);
      }
    );
  }
  

  procesarPasajeros() {
    this.pasajerosList = [];
    this.reservas.forEach((reserva: any) => {
      reserva.passengers.forEach((pasajero: any) => {
        this.pasajerosList.push({
          ...pasajero,
          reservationCode: reserva.reservationCode,
          service: reserva.service
        });
      });
    });
  }

  fecha(serviceId: any) {
    const servicioEncontrado = this.services.find((s: any) => s.id === serviceId);
    if (servicioEncontrado) {
      return `${servicioEncontrado.departureDate} ${servicioEncontrado.departureTime}`;
    }
    return 'No disponible';
  }

}



