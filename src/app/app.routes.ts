import { Routes } from '@angular/router';
import { ListaReservasComponent } from './components/lista-reservas/lista-reservas.component';
import { GenerarReservaComponent } from './components/generar-reserva/generar-reserva.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'lista',    
        pathMatch: 'full'

    },
    {
        path: 'lista',
        component: ListaReservasComponent
    },
    {
        path: 'generarReserva',
        component: GenerarReservaComponent
    }
];
