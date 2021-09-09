import {Tabla} from "./Tabla";
export class Producto extends Tabla{
    
    private id:number;
    private idVendedor:number;
    private nombre:string;
    private precio:number; 
    private stock:number;
    private usado:boolean;

    constructor(id:number, idVendedor:number, nombre:string, precio:number,stock:number,usado:boolean) {
        super();
        this.id=id;
        this.idVendedor=idVendedor;
        this.nombre=nombre;
        this.precio=precio;
        this.stock=stock;
        this.usado=usado;
    }

    getPrecio(): number {
        return this.precio;
    }
    getVendedor():number{
        return this.idVendedor;
    }

    getId(): number {
        return this.id;
    }

    getNombre(): string {
        return this.nombre;
    }

    getStock(): number {
        return this.stock;
    }

    getUsado(): boolean {
        return this.usado;
    }

    setId(value: number) {
        this.id = value;
    }

    setIdVendedor(idVendedor: number) {
        this.idVendedor = idVendedor;
    }

    setNombre(nombre: string) {
        this.nombre = nombre;
    }

    setPrecio(precio: number) {
        this.precio = precio;
    }

    setStock(value: number) {
        this.stock = value;
    }

    setUsado(usado: boolean) {
        this.usado = usado;
    }

    static async find(id: number):Promise<Producto>{
        return new Promise(function (resolve, reject) {
            Producto.crearConexion().query(`SELECT * from productos where id=${id}`, function (error, results) {
                if(error) reject(error);
                if(results.length!=0){
                    let productoEncontrado= new Producto(results[0].id,results[0].vendedor,results[0].nombre, results[0].precio, results[0].stock, results[0].usado);
                    resolve(productoEncontrado);
                }
                else{
                    resolve(null); //retorna nulo si no lo encuentra
                }
            });
        });
    }

    static async get(){
        return new Promise(function (resolve, reject){
            Producto.crearConexion().query("select productos.id, productos.nombre, stock, usado, vendedor, precio, usado from productos left join usuarios on usuarios.id=vendedor "+Producto.getQuery(), function (error, results, fields){
                if (error) resolve(error);
                let productosEncontrados:Array<Producto> = new Array();
                results.forEach(element => {
                    productosEncontrados.push(new Producto(element.id,element.vendedor,element.nombre, element.precio, element.stock, element.usado));
                });
                Producto.borrarQuery();
                resolve(productosEncontrados);
            });
        });
    }

    async save(){
        let id = this.getId();
        let idVendedor = this.getVendedor();
        let nombre = this.getNombre();
        let precio = this.getPrecio();
        let stock = this.getStock();
        let usado = this.getUsado();
        console.log(stock);
        if(await Producto.find(id)==null){ //si el producto no existe hacemos insert
            return new Promise(function (resolve, reject){
                Producto.crearConexion().query(`Insert into productos values(null,${id},${idVendedor},"${nombre}",${precio}, ${stock}, ${usado})`, function (error, results) {
                    if (error) resolve(error);
                    else resolve('Producto agregado'); 
                });
            });
        }
        else{
            return new Promise(function (resolve, reject){
                Producto.crearConexion().query(`update productos set vendedor=${idVendedor}, nombre="${nombre}", precio=${precio}, stock=${stock}, usado=${usado} where id=${id}`, function (error, results) {
                    if (error) resolve(error);
                    else resolve('Producto actualizado'); 
                });
            });
        }
    }
    
}