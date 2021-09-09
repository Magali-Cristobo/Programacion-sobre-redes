import { Component, OnInit } from '@angular/core';
import { MiservicioService } from '../miservicio.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-reservar',
  templateUrl: './reservar.component.html',
  styleUrls: ['./reservar.component.scss']
})
export class ReservarComponent implements OnInit {
  funciones: number[];
  idFuncion:number;
  butacas: string[];
  butacasTotales:string[];
  butacasAReservar:string[];
  respuesta:string;
  sala:number;
  butacasOcupadas:string[];
  estados:Map<string, boolean>;

  constructor(public servicio:MiservicioService, private rutaActiva: ActivatedRoute) { 
    this.funciones=[];
    this.butacas=[];
    this.butacasAReservar=[];
    this.butacasTotales=[];
    this.idFuncion = 0;
    this.respuesta="";
    this.sala=0;
    this.butacasOcupadas=[];
    this.rutaActiva.paramMap.subscribe(params => {
      this.ngOnInit();
    });
    this.estados=new Map();
  }

  
  ngOnInit(): void {
    this.sala=this.rutaActiva.snapshot.params.sala;
    this.idFuncion=this.rutaActiva.snapshot.params.id;
    this.butacas=this.rutaActiva.snapshot.params.butacas;
    this.butacas= JSON.parse(this.rutaActiva.snapshot.params.butacas);
    this.servicio.obtenerButacas(this.sala).subscribe(data => {
      this.butacasTotales=JSON.parse(data.butacas);
      this.obtenerButacasOcupadas();
    });
    
  }

  public reservar(idFuncion:number, idUsuario:number, butacas:String[]):void{
    this.servicio.reservar(idFuncion,idUsuario,JSON.stringify(butacas)).subscribe(data => {
      this.respuesta=data;
    });
  }

  public elegirButaca(butaca:string):void{
    if(this.butacasAReservar.length==6){
      this.estados.set(this.butacasAReservar[0],false);
      this.butacasAReservar.shift();
    }
    if(this.butacasAReservar.includes(butaca)){
      this.butacasAReservar.splice(this.butacasAReservar.indexOf(butaca));
      this.estados.set(butaca,false);
    }
    else{
      this.butacasAReservar.push(butaca);
      this.estados.set(butaca,true);
    }
    console.log(this.butacasAReservar);
  }  

  public obtenerButacasOcupadas():void{
    this.butacasOcupadas=[];
    for (let i = 0; i < this.butacasTotales.length; i++) {
      if(!this.butacas.includes(this.butacasTotales[i])){
        this.butacasOcupadas.push(this.butacasTotales[i]);
      }
      else{
        this.estados.set(this.butacasTotales[i],false);
      }
    }
  }
}
