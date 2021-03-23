export enum Region{AR,BR,CH}

abstract class Titulo{// abstracta porque nunca la vamos a instanciar
    private titulo: string;
    private regiones:Array<Region>;
    private contenidos:Array<Contenido>;
    constructor(titulo:string){
        this.regiones=[];
        this.contenidos=[];
        this.titulo=titulo;
    }
    getTitulo():string{
        return this.titulo;
    }

    setTitulo(nuevo:string){
        this.titulo=nuevo;
    }

    disponible(region:Region):boolean{ //si esta dentro del arreglo de regiones
        return this.regiones.includes(region);
    }

    agregarRegion(region:Region){
        this.regiones.push(region);
    }
    
    quitarRegion(region:Region){
        let posicionRegion:number = this.regiones.indexOf(region);//obtengo el indice de esa region
        this.regiones.splice(posicionRegion, 1 );//la saco del arreglo
    }

    getDuracionTotal():number{
        let duracion:number=0;
        this.contenidos.forEach(contenidoActual => {
            duracion+=contenidoActual.getDuracion();
        });
        return duracion;
    }

    getContenidos():Array<Contenido>{
        return this.contenidos;
    }

    getRegiones():Array<Region>{
        return this.regiones;
    }

}

export class Pelicula extends Titulo{
    constructor(titulo:string){
        super(titulo);
    }
    
    setContenido(contenido:Contenido){
        this.getContenidos()[0]=contenido;
    }

}

export class Contenido{
    private duracion:number;
    private date:Date; 

    constructor(duracion:number){
        this.duracion=duracion;
        this.date=new Date()
    }
    getDate():Date{
        return this.date;
    }
    getDuracion():number{
        return this.duracion;
    }
}


export class Serie extends Titulo{
    constructor(titulo:string){
        super(titulo);
    }

    agregarCapitulo(capitulo:Contenido){
        this.getContenidos().push(capitulo);
    }

    obtenerCapitulo(capitulo:number):Contenido{
        return this.getContenidos()[capitulo];
    }

    cantidadDeCapitulos():number{
        return this.getContenidos().length;
    }

    primerCapitulo():Contenido{
        return this.getContenidos()[0];
    }
}

export class Usuario{
    private region:Region;
    private username:string;
    private titulosVistos:Array<Titulo>;
    private titulosViendo: Map<Titulo, [number,number]>;

    constructor(username:string, region:Region){
        this.username=username;
        this.region=region;
        this.titulosVistos=[];
        this.titulosViendo=new Map();
    }

    getUsername():string{
        return this.username;
    }

    getRegion():Region{
        return this.region;
    }

    visto(titulo:Titulo):boolean{ // considero que si esta en el arreglo es porque ya la vio
        return this.titulosVistos.includes(titulo);
    }
    
    viendo(titulo:Titulo):boolean{ //lo mismo que en el anterior
        return this.titulosViendo.has(titulo);
    }

    capituloActual(serie:Titulo):number{ 
        let capitulo:number=0;
        if(this.getTitulosViendo().has(serie)){ 
            capitulo=this.getTitulosViendo().get(serie)[0]; //podria retornar esto directamente, pero si no esta viendo la serie, va a dar error
        }
        return capitulo;
    }

    ver(titulo:Titulo, tiempoVisualizado:number):boolean{
        let tiempoCapitulo:number=0;
        let capitulo:number=0;
        let tiempoVistoAnterior:number=0;
        if(!titulo.getRegiones().includes(this.region)){
            return false;
        }
        if(this.getTitulosViendo().has(titulo)){
            capitulo=this.getTitulosViendo().get(titulo)[0];
            tiempoVistoAnterior=this.getTitulosViendo().get(titulo)[1];
        }
        if(titulo.getContenidos().length>0){
            for(let i:number=capitulo;tiempoVisualizado>0;i++){
                tiempoCapitulo=titulo.getContenidos()[i].getDuracion();
                if(tiempoVisualizado+tiempoVistoAnterior>=tiempoCapitulo){
                    tiempoVisualizado=tiempoVisualizado+tiempoVistoAnterior-tiempoCapitulo;
                    tiempoVistoAnterior=0;
                    this.getTitulosViendo().set(titulo,[i+1,tiempoVisualizado]);
                }
                else{
                    this.getTitulosViendo().set(titulo,[i,tiempoVisualizado+tiempoVistoAnterior]);
                    tiempoVisualizado=0;
                }
            }
        }
        if(this.getTitulosViendo().get(titulo)[0]>titulo.getContenidos().length-1){// si ya termino la serie/pelicula
            this.titulosVistos.push(titulo);
            this.titulosViendo.delete(titulo);
        }
       
        return true
    }

    getTitulosViendo():Map<Titulo,[number,number]>{
        return this.titulosViendo;
    }

    getTitulosVistos():Array<Titulo>{
        return this.titulosVistos;
    }
}

export class Sistema{
    usuarios:Array<Usuario>;
    titulos: Array<Titulo>;
    
    constructor(){
        this.titulos=[];
        this.usuarios=[];
    }

    agregarUsuario(usuario:Usuario):boolean{
        for(let i=0;i<this.getUsuarios().length;i++){
            if(this.getUsuarios()[i].getUsername()==usuario.getUsername()){
                return false;
            }
        }
        this.getUsuarios().push(usuario);
        return true;
    }

    agregarTitulo(titulo:Titulo){
        this.titulos.push(titulo);
    }

    buscarUsuario(nombre:string):Usuario{//ver como hacer cuando no existe el usuario
        for(let i=0;i<this.getUsuarios().length;i++){
            let usuarioActual:Usuario=this.getUsuarios()[i];
            if(usuarioActual.getUsername()==nombre){
                return usuarioActual;
            }
        }
        return new Usuario("",0);
    }

    buscarTitulo(nombre:string):Array<Titulo>{
        let titulos:Array<Titulo>=[];
        for(let i=0;i<this.getTitulos().length;i++){
            let tituloActual=this.getTitulos()[i];
            if(tituloActual.getTitulo()==nombre){
                titulos.push(tituloActual);
            }
        }
        return titulos;
    }
    
    getUsuarios():Array<Usuario>{
        return this.usuarios;
    }

    getTitulos():Array<Titulo>{
        return this.titulos;
    }
}
