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

    setTitulo(tituloNuevo:string){
        this.titulo=tituloNuevo;
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
        this.getContenidos[0]=contenido;
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
        return this.titulosViendo.get(serie)[0];
    }

    ver(titulo:Titulo, tiempo_visualizado:number):boolean{ 
        let capitulo:number=0;
        let minutosVistos:number=0;
        let duracionCapitulo:number=titulo.getContenidos()[capitulo].getDuracion();

        if(!titulo.getRegiones().includes(this.region)){
            return false;
        }

        if(this.titulosViendo.has(titulo)){
            while(tiempo_visualizado>0){
                capitulo=this.titulosViendo.get(titulo)[0];
                minutosVistos=this.titulosViendo.get(titulo)[1];
                if(minutosVistos+tiempo_visualizado>=duracionCapitulo){
                    this.titulosViendo.set(titulo,[capitulo+1,minutosVistos+tiempo_visualizado-duracionCapitulo]);
                }
                else{
                    this.titulosViendo.set(titulo,[capitulo,minutosVistos+tiempo_visualizado]);
                }
                tiempo_visualizado-duracionCapitulo;
            }
        }//falta hacer la condicion de else
        else{ //si recien la arranca a ver
            this.getTitulosViendo().set(titulo,[0,titulo.getContenidos()[0].getDuracion()]);
            this.ver(titulo,tiempo_visualizado-titulo.getContenidos()[0].getDuracion());
        }
        
        if(capitulo+1>titulo.getContenidos().length){ // si ya vio todo el titulo
            this.titulosVistos.push(titulo);
            this.titulosViendo.delete(titulo);
        }

        return true;
    }
    getTitulosViendo():Map<Titulo,[number,number]>{
        return this.titulosViendo;
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

    // buscarUsuario(nombre:string):Usuario{//ver como hacer cuando no existe el usuario
    //     this.usuarios.forEach(usuario => {
    //         if(usuario.getUsername()==nombre){
    //             return usuario;
    //         }
    //     });
    //     return 0;
    // }

    buscarTitulo(nombre:string):Array<Titulo>{
        let titulos:Array<Titulo>;
        this.titulos.forEach(titulo => {
            if(titulo.getTitulo()==nombre){
                titulos.push(titulo);
            }
        });
        return titulos;
    }

}
