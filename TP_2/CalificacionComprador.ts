import {Calificacion} from "./Calificacion";
import {Compra} from "./Compra";
import { Usuario } from "./Usuario";

export class CalificacionComprador extends Calificacion  {
    constructor(fecha:Date,id:number, calificacion:number,vendedor:Usuario,comprador:Usuario){
        super(fecha,id,calificacion, vendedor, comprador);
    }

    static async find(id: number):Promise<CalificacionComprador>{
        return new Promise(function (resolve, reject) {
            CalificacionComprador.crearConexion().query(`SELECT * from calificaciones_compradores where id=${id}`, function (error, results) { // suponemos q el id de la tabla es el id de la compra
                if(error) resolve (error);
                if(results.length!=0){
                    let calificacion=new CalificacionComprador(results[0].fecha,results[0].id,results[0].calificacion,results[0].id_vendedor, results[0].id_comprador);
                    resolve(calificacion);
                }
                else{
                    resolve(null);
                }
            });
        });
    }

    static async get(){
        return new Promise(function (resolve, reject){
            CalificacionComprador.crearConexion().query("select * from calificaciones_compradores "+CalificacionComprador.getQuery(), function (error, results, fields){
                if (error) resolve (error);
                let calificaciones:Array<CalificacionComprador> = new Array();
                results.forEach(element => {
                    calificaciones.push(new CalificacionComprador(element.fecha,element.id,element.calificacion,element.id_vendedor, element.id_comprador));
                });
                CalificacionComprador.borrarQuery();
                resolve (calificaciones);
            });
        });
    }
    
    async save(){
        let fecha=this.getFecha();
        let idVendedor=this.getVendedor().getId();
        let idComprador=this.getComprador().getId();
        let calificacion=this.getCalificacion();
        return new Promise(function (resolve, reject){
            CalificacionComprador.crearConexion().query(`Insert into calificaciones_compradores values(null, ${idComprador}, ${idVendedor}, ${calificacion},"${fecha}")`, function (error, results) {
                if (error) resolve(error);
                else resolve('Calificacion realizada'); 
            });
        });
    }

}