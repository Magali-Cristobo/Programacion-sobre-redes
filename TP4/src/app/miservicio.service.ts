import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MiservicioService {

  constructor(private http: HttpClient) {}

  public getFunciones(): Observable<any> {
    return this.http.get("http://localhost:3000/funciones");
  }

  public reservar(idFuncion:number, idUsuario:number,butacas:String):  Observable<any>{
    console.log(idFuncion," ",idUsuario," ", butacas);
    let datos={"id_funcion":idFuncion,"user_id":idUsuario,"butacas":butacas};
    return this.http.post("http://localhost:3000/reservar",datos, {responseType: 'text'});
  }

  public obtenerButacas(idSala:number): Observable<any>{
    return this.http.get("http://localhost:3000/butacas/"+idSala);
  }

}
