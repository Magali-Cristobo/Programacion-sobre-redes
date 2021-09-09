import { Component, OnInit } from '@angular/core';
import { MiservicioService } from '../miservicio.service';

@Component({
  selector: 'app-funciones',
  templateUrl: './funciones.component.html',
  styleUrls: ['./funciones.component.scss']
})
export class FuncionesComponent implements OnInit {
  funciones: any[] = [];
  constructor(public servicio:MiservicioService) { }

  ngOnInit(): void {
    this.servicio.getFunciones().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        this.funciones.push(data[i]);
        console.log(data[i]);
      }
    });
  }

}
