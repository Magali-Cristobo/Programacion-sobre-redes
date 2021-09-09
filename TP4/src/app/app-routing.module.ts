import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuncionesComponent } from './funciones/funciones.component';
import { ReservarComponent } from './reservar/reservar.component';

const routes: Routes = [ { path: 'funciones', component: FuncionesComponent },
{ path: 'reservar/:id/:butacas/:sala', component: ReservarComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
