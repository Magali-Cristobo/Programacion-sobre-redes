export enum Region{AR,BR,CH}

abstract class Titulo{// abstracta porque nunca la vamos a instanciar
    titulo: string;
    regiones:Array<Region>;
    contenidos:Array<Contenido>;
    constructor(titulo:string){
        this.regiones=[];
        this.contenidos=[];
        this.titulo=titulo;
    }
    getTitulo(){
        return this.titulo;
    }
    setTitulo(tituloNuevo:string):void{
        this.titulo=tituloNuevo;
    }
    disponible(region:Region):boolean{ //si esta dentro del arreglo de regiones
        return this.regiones.includes(region);
    }

    agregarRegion(region:Region){
        this.regiones.push(region);
    }
    quitarRegion(region:Region){// ver si funciona
        let posicionRegion:number = this.regiones.indexOf( region );
        this.regiones.splice( posicionRegion, 1 );
    }

    getDuracionTotal():number{
        let duracion:number=0;
        this.contenidos.forEach(contenidoActual => {
            duracion+=contenidoActual.getDuracion();
        });
        return duracion;
    }

}

export class Pelicula extends Titulo{
    constructor(titulo:string){
        super(titulo);
    }
    setContenido(contenido:Contenido){
        this.contenidos[0]=contenido;
    }
    getContenido():Contenido{
        return this.contenidos[0];
    }
    
}

export class Contenido{
    duracion:number;
    date:Date; 

    constructor(duracion:number){
        this.duracion=duracion;
        this.date=new Date()
    }
    getDate(){
        return this.date;
    }
    getDuracion(){
        return this.duracion;
    }
}


export class Serie extends Titulo{
    constructor(titulo:string){
        super(titulo);

    }
    agregarCapitulo(capitulo:Contenido){
        this.contenidos.push(capitulo);
    }
    obtenerCapitulo(capitulo:number):Contenido{
        return this.contenidos[capitulo];
    }
    cantidadDeCapitulos():number{
        return this.contenidos.length;
    }
    primerCapitulo():Contenido{
        return this.contenidos[0];
    }
}

export class Usuario{
    region:Region;
    username:string;
    titulosVistos:Array<Titulo>;
    titulosViendo: Map<Titulo, number>;

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
        return this.region; // me tira la pos del enum (0,1,2) no AR, BR, o CH
    }
    visto(titulo:Titulo):boolean{ // considero que si esta en el arreglo es porque ya la vio
        return this.titulosVistos.includes(titulo);
    }
    viendo(titulo:Titulo):boolean{ //lo mismo que en el anterior
        return this.titulosViendo.has(titulo);
    }
    capituloActual(serie:Titulo):number{
        let capitulo:number=0;
        let tiempoVistoSerie=this.titulosViendo.get(serie);
        for(let i=0; i<serie.contenidos.length;i++){
            if(serie.contenidos[i].getDuracion()>tiempoVistoSerie){
                return capitulo;
            }
            tiempoVistoSerie-=serie.contenidos[i].getDuracion();
            capitulo++;
        }
    
        return 0;
    }

    ver(titulo:Titulo, tiempo_visualizado:number):boolean{ 
        let tiempoVistoAnterior:number=0;
        if(!titulo.regiones.includes(this.region)){
            return false;
        }
        if(this.titulosViendo.has(titulo)){
            tiempoVistoAnterior=this.titulosViendo.get(titulo);
        }
        if(titulo.getDuracionTotal()<=tiempo_visualizado+tiempoVistoAnterior){
            this.titulosVistos.push(titulo);
            this.titulosViendo.delete(titulo);
        }
        else{
            this.titulosViendo.set(titulo,tiempo_visualizado+tiempoVistoAnterior);
        }
        return true;
    }
}

export class Sistema{
    usuarios:Array<Usuario>;
    titulos: Array<Titulo>;
    
    constructor(){
        this.titulos=[];
        this.usuarios=[];
    }

    agregarUsuario(usuario:Usuario){
        this.usuarios.push(usuario);
    }
    agregarTitulo(titulo:Titulo){
        this.titulos.push(titulo);
    }
}
