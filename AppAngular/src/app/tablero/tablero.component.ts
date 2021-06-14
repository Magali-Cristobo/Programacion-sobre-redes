import { Component } from '@angular/core';

@Component({
  selector: 'tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.scss']
})
export class TableroComponent {
  estados=['','','','','','','','',''];
  quienSigue="X";
  ganador: string="";

  obtenerJugador():string{
    return this.quienSigue;
  }

  mover(casilla:number){
    if(this.estados[casilla]==""){
      this.estados[casilla]=this.quienSigue;
      this.quienSigue=this.quienSigue == "X" ? "O" : "X";
    }
    this.ganador = this.calcularGanador();
  }

  calcularGanador():string {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        this.estados[a] &&
        this.estados[a] === this.estados[b] &&
        this.estados[a] === this.estados[c]
      ) {
        return this.estados[a];
      }
    }
    return "";
  }

}
