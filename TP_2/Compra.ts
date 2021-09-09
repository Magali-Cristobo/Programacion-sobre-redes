import { Producto } from "./Producto";
import {Tabla} from "./Tabla";
import {Usuario} from "./Usuario";

export class Compra extends Tabla{
    
    private id:number;
    private producto: Producto; 
    private cantidad:number;
    private comprador: Usuario;
    private fecha:Date;
    private compradorCalificado: boolean;
    private vendedorCalificado:boolean;

    constructor(id:number,producto:Producto, cantidad:number, comprador:Usuario, fecha:Date, compradorCalificado:boolean= false, vendedorCalificado:boolean=false){
        super();
        this.id=id;
        this.producto=producto;
        this.cantidad=cantidad;
        this.comprador=comprador;
        this.fecha=fecha;
        this.compradorCalificado = compradorCalificado;
        this.vendedorCalificado = vendedorCalificado;
    }

    public getId():number{
        return this.id;
    }

    public setId(id:number){
        this.id=id;
    }

    public getProducto():Producto{
        return this.producto;
    }
    public setProducto(producto:Producto){
        this.producto = producto;
    }
    public getCantidad():number{
        return this.cantidad;
    }
    public setCantidad(cant:number){
        this.cantidad = cant;
    }
    public getComprador():Usuario{
        return this.comprador;
    }
    public setComprador(comprador:Usuario){
        this.comprador = comprador;
    }
    public getFecha():Date{
        return this.fecha;
    }
    public setFecha(fecha:Date){
        this.fecha = fecha;
    }
    public getCompradorCalificado(){
        return this.compradorCalificado;
    }
    public setCompradorCalificado(compradorCalificado:boolean){
        this.compradorCalificado=compradorCalificado;
    }
    public getVendedorCalificado(){
        return this.vendedorCalificado;
    }
    public setVendedorCalificado(vendedorCalificado:boolean){
        this.vendedorCalificado=vendedorCalificado;
    }

    static find(id: number):Promise<Compra>{
        return new Promise(function (resolve, reject) {
            Compra.crearConexion().query(`SELECT * from compras where id=${id}`, async function (error, results) {
                if(error) reject(error);
                if(results.length!=0){
                    let compraEncontrada=new Compra(results[0].id,await Producto.find(results[0].id_producto),results[0].cantidad, await Usuario.find(results[0].id_usuario), results[0].fecha, results[0].comprador_calificado,results[0].vendedor_calificado);
                    resolve(compraEncontrada);
                }
                else{
                    resolve(null);
                }
            });
        });
    }

    static async get(){
        return new Promise(function (resolve, reject){
            Compra.crearConexion().query("select * from compras "+Compra.getQuery(), function (error, results, fields){
                if (error) resolve (error);
                let comprasEncontradas:Array<Compra> = new Array();
                results.forEach(element => {
                    comprasEncontradas.push(new Compra(element.id,element.id_producto, element.cantidad, element.id_usuario, element.fecha, element.comprador_calificado, element.vendedor_calificado));
                });
                Compra.borrarQuery();
                resolve (comprasEncontradas);
            });
        });
    }
    
    async save(){
        let id = this.getId();
        let idComprador = this.getComprador().getId();
        let cantidad = this.getCantidad();
        let fecha = this.getFecha();
        let idProducto = this.getProducto().getId();
        let vendedorCalificado = this.getVendedorCalificado();
        let compradorCalificado = this.getCompradorCalificado();
        if(id==0){// si el id es 0 la compra no esta en la base
            return new Promise(function (resolve, reject){
                Compra.crearConexion().query(`Insert into compras values(null,${idComprador},${idProducto},${cantidad}, "${fecha}", 0, 0)`, function (error, results) {
                    if (error) resolve(error);
                    else resolve('Compra realizada'); 
                });
            });
        }
        else{
            return new Promise(function (resolve, reject){
                Compra.crearConexion().query(`update compras set id_usuario=${idComprador}, cantidad=${cantidad}, id_producto=${idProducto}, comprador_calificado=${compradorCalificado} , vendedor_calificado=${vendedorCalificado} where id=${id}`, function (error, results) {
                    if (error) resolve(error);
                    else resolve('Compra actualizada'); 
                });
            });
        }
    }
}