import {Compra} from "./Compra";
import {Tabla} from "./Tabla";
import { Usuario } from "./Usuario";

export abstract class Calificacion extends Tabla{

    private id:number;
    private fecha: Date;
    private vendedor:Usuario;
    private comprador:Usuario;
    private calificacion: number;

    constructor(fecha:Date,id:number, calificacion:number,vendedor:Usuario,comprador:Usuario){
        super();
        this.id = id;
        this.fecha = fecha;
        this.calificacion = calificacion;
        this.vendedor=vendedor;
        this.comprador=comprador;
    }

    public getFecha():Date{
        return this.fecha;
    }
    
    public getId():number{
        return this.id;
    }

    public getCalificacion():number{
        return this.calificacion;
    }

    public getVendedor():Usuario{
        return this.vendedor;
    }

    public getComprador():Usuario{
        return this.comprador;
    }

    public setFecha(fecha: Date){
        this.fecha = fecha;
    }
    
    public setCalificacion(calificacion:number){
        this.calificacion = calificacion;
    }
    
    public setComprador(comprador: Usuario){
        this.comprador =  comprador;   
    }

    public setId(id:number){
        this.id=id;
    }

    public setVendedor(vendedor: Usuario){
        this.vendedor =  vendedor;   
    }
}