import { Tabla } from "./Tabla";
import { Favorito } from "./Favorito";

export class Usuario extends Tabla {

    private id: number;
    private username: string;
    private calificacionVendedor: number;
    private calificacionComprador: number;
    private favoritos: Array <Favorito>; //dejamos array para que en el json se vea
    private saldo: number;


    constructor (id: number, username: string,saldo:number, calificacionVendedor: number, calificacionComprador: number, fav:Array<Favorito> = []) {
        super();
        this.id = id;
        this.username = username;
        this.saldo=saldo;
        this.calificacionVendedor = calificacionVendedor;
        this.calificacionComprador = calificacionComprador;
        this.favoritos = fav;
        Usuario.query=" ";
        
    }

    public getSaldo(){
        return this.saldo;
    }

    public setSaldo(saldo:number){
        this.saldo = saldo;
    }

    public getId(): number {
        return this.id;
    }

    public setId(value: number) {
        this.id = value;
    }

    public getUsername(): string {
        return this.username;
    }
    public getFavoritos(): Array<Favorito> {
        return this.favoritos;
    }

    public setUsername(value: string) {
        this.username = value;
    }
    public setFavoritos(value: Array<Favorito>) {
        this.favoritos = value;
    }

    public getCalificacionVendedor(): number {
        return this.calificacionVendedor;
    }

    public setCalificacionVendedor(value) {
        this.calificacionVendedor = value;
    }

    public getCalificacionComprador(): number {
        return this.calificacionComprador;
    }

    public setCalificacionComprador(value) {
        this.calificacionComprador = value;
    }
  
    static async find(id: number):Promise<Usuario>{
        return new Promise(async function (resolve, reject) {
            let favoritos= new Array<Favorito>();
            favoritos=await Favorito.where("id_usuario","=",""+id+"").get();
            Usuario.crearConexion().query(`SELECT * from usuarios where id=${id}`, function (error, results) {
                if(error) reject(error);
                if(results.length!=0){
                    let usuarioEncontrado=new Usuario(results[0].id,results[0].username,results[0].saldo,results[0].calificacion_vendedor, results[0].calificacion_comprador, favoritos);
                    resolve(usuarioEncontrado);
                }
                else{
                    resolve(null); //si no encuentra nada retorna null
                }
                
            });
        });
    }
   
    static async get(){
        return new Promise(async function (resolve, reject){
            Usuario.crearConexion().query("select * from usuarios "+Usuario.getQuery(), function (error, results, fields){
                if (error) reject(error);
                let usuariosEncontrados:Array<Usuario> = new Array();
                results.forEach(async element => {
                    let favoritos= new Array<Favorito>();
                    favoritos=await Favorito.where("id_usuario","=",""+element.id+"").get();
                    usuariosEncontrados.push(new Usuario(element.id,element.username,element.usuario,element.calificacion_vendedor, element.calificacion_comprador,favoritos));
                });
                Usuario.borrarQuery();
                resolve (usuariosEncontrados);
            });
        });
    }

    async save(){
        let id = this.getId();
        let username = this.getUsername();
        let saldo = this.getSaldo();
        let calificacionVendedor = this.getCalificacionVendedor();
        let calificacionComprador = this.getCalificacionComprador();
        let favoritos = this.getFavoritos();
        if (await Usuario.find(id)==null){ //si el usuario no existe hacemos inserts
            return new Promise(function (resolve, reject){
                Usuario.crearConexion().query(`Insert into usuarios values(null,${id},"${username}",${calificacionVendedor},${calificacionComprador})`, function (error, results) {
                    if (error) resolve(error);
                    else resolve('Usuario agregado'); 
                });
                for(let i=0;i<favoritos.length;i++){
                    Usuario.crearConexion().query(`Insert into favoritos values(null,${id},${favoritos[i]})`, function (error, results) {
                        if (error) resolve(error);
                        else resolve('Favorito agregado'); 
                    });
                }
            });
        }
        else{// para hacer el update le mandamos todos los atributos siempre
            return new Promise(function (resolve, reject){
                Usuario.crearConexion().query(`update usuarios set username="${username}", saldo=${saldo}, calificacion_vendedor=${calificacionVendedor},calificacion_comprador=${calificacionComprador} where id=${id}`, function (error, results) {
                    if (error) reject(error);
                    else resolve('Usuario actualizado'); 
                });
            });
        }
    }
    public async obtenerPromedioVendedor(){
        let id=this.getId();
        return new Promise(function (resolve, reject) {// hace una query q busca el promedio de las calificaciones del vendedor y la devuelve
            Usuario.crearConexion().query(`select avg(calificacion) as promedio from calificaciones_compradores where id_vendedor=${id}`, function (error, results) {
                if(error) throw (error);
                resolve(results[0].promedio);
            });
        });
    }

    public async obtenerPromedioComprador(){ // hace una query q busca el promedio de las calificaciones del comprador y la devuelve
        let id=this.getId();
        return new Promise(function (resolve, reject) {
            Usuario.crearConexion().query(`select avg(calificacion) as promedio from calificaciones_vendedores where id_comprador=${id}`, function (error, results) {
                if(error) throw (error);
                resolve(results[0].promedio);
            });
        });
    }    
}
