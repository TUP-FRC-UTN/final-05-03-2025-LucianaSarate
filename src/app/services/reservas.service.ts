import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  constructor(private http: HttpClient) { }

  getReservas(){
    return this.http.get(`https://671fe287e7a5792f052fdf93.mockapi.io/reservations`);
  }

  getServices(){
    return this.http.get(`https://679b8dc433d31684632448c9.mockapi.io/services`);
  }
  getCiudades(){
    return this.http.get(`https://679b8dc433d31684632448c9.mockapi.io/cities`);
  }

  postReserva(reserva:any){
    return this.http.post(`https://671fe287e7a5792f052fdf93.mockapi.io/reservations`, reserva);
  }

  verificarDocumento(documento: string, serviceId: string) {
    return this.getReservas().pipe(
      map((reservas: any) => {
        return reservas.some((reserva: any) => 
          reserva.service.id === serviceId && 
          (reserva.document === documento || 
           reserva.passengers.some((p: any) => p.document === documento))
        );
      })
    );
  }

  buscarServicios(origen: string, destino: string, fecha: string) {
    return this.getServices().pipe(
      map((services: any) => services.filter((service: any) => 
        service.origin.toString() === origen && 
        service.destination.toString() === destino && 
        service.departureDate === fecha
      ))
    );
  }

  generarCodigoReserva(nombre: string, apellido: string, documento: string) {
    const iniciales = nombre.charAt(0) + apellido.charAt(0);
    const ultimos3 = documento.slice(-3);
    const unique = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${iniciales}${ultimos3}-${unique}`;
  }
}
