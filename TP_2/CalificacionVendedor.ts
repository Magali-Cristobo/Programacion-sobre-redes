import { Calificacion } from "./Calificacion";
import { Compra } from "./Compra";
import { Usuario } from "./Usuario";

export class CalificacionVendedor extends Calificacion{
    constructor(fecha:Date,id:number, calificacion:number,vendedor:Usuario,comprador:Usuario){
        super(fecha,id,calificacion, vendedor, comprador);
    }

    static async find(id: number):Promise<CalificacionVendedor>{
        return new Promise(function (resolve, reject) {
            CalificacionVendedor.crearConexion().query(`SELECT * from calificaciones_vendedores where id=${id}`, function (error, results) {
                if(error) resolve (error);
                if(results.length!=0){
                    let calificacion=new CalificacionVendedor(results[0].fecha,results[0].id,results[0].calificacion,results[0].id_vendedor, results[0].id_comprador);
                    resolve(calificacion);
                }
                else{
                    resolve(null);// retorna null si no lo encuentra
                }
                
            });
        });
    }

    static async get(){
        return new Promise(function (resolve, reject){
            CalificacionVendedor.crearConexion().query("select * from calificaciones_vendedores "+CalificacionVendedor.getQuery(), function (error, results, fields){
                if (error) resolve (error);
                let calificaciones:Array<CalificacionVendedor> = new Array();
                results.forEach(element => {
                    calificaciones.push(new CalificacionVendedor(element.fecha,element.id,element.calificacion,element.id_vendedor, element.id_comprador));
                });
                CalificacionVendedor.borrarQuery();
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
            CalificacionVendedor.crearConexion().query(`Insert into calificaciones_vendedores values(null, ${idVendedor}, ${idComprador}, ${calificacion},"${fecha}")`, function (error, results) {
                if (error) resolve(error);
                else resolve('Calificacion realizada'); 
            }); 
        });
       
    }
}