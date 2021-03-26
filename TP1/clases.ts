export enum Region{AR,BR,CH}

abstract class Titulo{// abstracta porque nunca la vamos a instanciar
    private titulo: string;
    private regiones:Array<Region>;
    constructor(titulo:string){
        this.regiones=[];
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

    getRegiones():Array<Region>{
        return this.regiones;
    }

}

export class Pelicula extends Titulo{
    private contenido:Contenido;
    constructor(titulo:string){
        super(titulo);
    }
    getContenido():Contenido{
        return this.contenido;
    }
    
    setContenido(contenido:Contenido){
        this.contenido=contenido;
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
    private capitulos:Array<Contenido>;
    constructor(titulo:string){
        super(titulo);
        this.capitulos=[];
    }

    agregarCapitulo(capitulo:Contenido){
        this.getCapitulos().push(capitulo);
    }

    obtenerCapitulo(capitulo:number):Contenido{
        return this.getCapitulos()[capitulo];
    }

    cantidadDeCapitulos():number{
        return this.getCapitulos().length;
    }

    primerCapitulo():Contenido{
        return this.getCapitulos()[0];
    }

    getCapitulos():Array<Contenido>{
        return this.capitulos;
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
        return this.getTitulosVistos().includes(titulo);
    }
    
    viendo(titulo:Titulo):boolean{ //lo mismo que en el anterior
        return this.getTitulosViendo().has(titulo);
    }

    capituloActual(serie:Titulo):number{ 
        let capitulo:number=0;
        if(this.getTitulosViendo().has(serie)){ 
            capitulo=this.getTitulosViendo().get(serie)[0]; //podria retornar esto directamente, pero si no esta viendo la serie, va a dar error
        }
        return capitulo;
    }

    ver(titulo:Titulo, tiempoVisualizado:number):boolean{
        let tiempoVistoAnterior:number=0;
        if(!titulo.disponible(this.getRegion())){
            return false;
        }
        if(titulo instanceof Pelicula){
            if(this.viendo(titulo)){
                tiempoVistoAnterior=this.getTitulosViendo().get(titulo)[1];
            }
            tiempoVisualizado+=tiempoVistoAnterior;
            if(titulo.getContenido().getDuracion()<=tiempoVisualizado){//si ya termino la pelicula
                this.titulosVistos.push(titulo);
                this.titulosViendo.delete(titulo);
            }
            else{
                this.titulosViendo.set(titulo,[0,tiempoVisualizado]);
            }
        }
        else if(titulo instanceof Serie){//tengo que usar else if porque sino no me deja usar metodos que son exclusivos de la clase serie
            let capitulos:Array<Contenido>=titulo.getCapitulos();
            let capituloActual:number=0;
            if(this.viendo(titulo)){
                capituloActual=this.getTitulosViendo().get(titulo)[0]; //capitulo que estoy viendo
                tiempoVistoAnterior=this.getTitulosViendo().get(titulo)[1];// tiempo que ya vi de ese capitulo
            }
            tiempoVisualizado+=tiempoVistoAnterior;
            for(let i:number=capituloActual, duracionCapitulo=capitulos[i].getDuracion();tiempoVisualizado>=duracionCapitulo;i++){
                tiempoVisualizado-=duracionCapitulo; //el tiempo que me faltaria ver de otro capitulo
                capituloActual++;
            } 
            if(capituloActual>capitulos.length-1){// si ya termino la serie
                this.titulosVistos.push(titulo);
                this.titulosViendo.delete(titulo);
            }
            else{
                this.getTitulosViendo().set(titulo,[capituloActual,tiempoVisualizado]);
            }
        }
        return true;
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

    buscarUsuario(nombre:string):Usuario{
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
