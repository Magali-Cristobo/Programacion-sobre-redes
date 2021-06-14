import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NumeroMagicoComponent } from './numero-magico/numero-magico.component';
import { CuadradoComponent } from './cuadrado/cuadrado.component';
import { CasillaComponent } from './casilla/casilla.component';
import { TableroComponent } from './tablero/tablero.component';

@NgModule({
  declarations: [
    AppComponent,
    NumeroMagicoComponent,
    CuadradoComponent,
    CasillaComponent,
    TableroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
