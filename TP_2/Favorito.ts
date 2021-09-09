import {Tabla} from "./Tabla";
import {Usuario} from "./Usuario";
import { Producto } from "./Producto";

export class Favorito extends Tabla{
    private id:number;
    private usuario: Usuario;//no se si deberia tener el usuario ya que el usuario tb tiene favoritos
    private producto:Producto;
    
    constructor(id:number, usuario:Usuario, producto:Producto){
        super();
        this.id=id;
        this.usuario=usuario;
        this.producto=producto;
    }
    
    
    public getId(){
        return this.id;
    }

    public getUsuario(){
        return this.usuario;
    }
    
    public getProducto() {
        return this.producto;
    }

    public setId(value: number) {
        this.id = value;
    }

    public setUsuario(value: Usuario) {
        this.usuario = value;
    }
    
    public setProducto(value: Producto) {
        this.producto = value;
    }


    static async find(id: number):Promise<Favorito>{
        return new Promise(function (resolve, reject) {
            Favorito.crearConexion().query(`SELECT * from favoritos where id=${id}`, function (error, results) {
                if(error) reject(error);
                if(results.length!=0){
                    let favoritoEncontrado= new Favorito(results[0].id,results[0].id_usuario,results[0].id_producto);
                    resolve(favoritoEncontrado);
                }
                else{
                    resolve(null); //retorna null si no lo encuentra
                }
            });
        });
    }
    
    static async get(){
        return new Promise(function (resolve, reject){
            Favorito.crearConexion().query("select * from favoritos "+Favorito.getQuery(), function (error, results, fields){
                if (error) resolve(error);
                let favoritoEncontrados:Array<Favorito> = new Array();
                results.forEach(element => {
                    favoritoEncontrados.push(new Favorito(element.id,element.id_usuario,element.id_producto));
                });
                Favorito.borrarQuery();
                resolve(favoritoEncontrados);
            });
        });
    }

    async save(){
        console.log("this ",this);
        console.log("usuario", this.getUsuario());
        let idUsuario = this.getUsuario().getId();
        let idProducto = this.getProducto().getId();
        return new Promise(function (resolve, reject){
            Favorito.crearConexion().query(`Insert into favoritos values(null,${idUsuario},${idProducto})`, function (error, results) {
                if (error) resolve(error);
                else resolve('Favorito insertado'); 
            });
        });
    
    }
    
}