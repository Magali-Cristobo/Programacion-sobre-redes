export enum Region {
    AR,
    BR,
    CH
}

export class Contenido {
    private date: Date;
    private duracion: number;

    constructor (duracion: number){
        this.duracion = duracion;
        this.date = new Date();
    }

    getDate(): Date{
        return this.date;
    }

    getDuracion(): number{
        return this.duracion;
    }

}

export abstract class Titulo {
    
    private titulo: string;
    private regionesDisponibles: Array<Region>;

    constructor (titulo:string){
        this.titulo = titulo;
        this.regionesDisponibles = new Array;
    }

    getRegionesDisponibles(): Array<Region>{
        return this.regionesDisponibles;
    }
    
    getTitulo(): string{
        return this.titulo;
    }

    setTitulo(nuevo: string){
        this.titulo = nuevo;
    }

    disponible(region: Region): boolean {
        for (let regionDisponible of this.regionesDisponibles) {
            if (regionDisponible == region) {
              return true;
            }
        }
        return false;
    }

    agregarRegion(region: Region): void {
        this.regionesDisponibles.push(region);
    }
    
    quitarRegion(region: Region): void {
        this.regionesDisponibles.forEach( (item, index) => {
            if(item === region) 
            this.regionesDisponibles.splice(index,1);
          });
    }
    
  

}

export class Pelicula extends Titulo {

    contenido: Contenido

    constructor (titulo: string) {
        super(titulo);
    }

    getContenido(): Contenido{
        return this.contenido;
    }

    setContenido(contenido: Contenido){
        this.contenido=contenido;
    }

    
}

export class Serie extends Titulo {

    contenidos: Array<Contenido>;
    
    constructor (titulo: string) {
        super(titulo);
        this.contenidos = new Array();
    }

    getContenidos(): Array<Contenido>{
        return this.contenidos;
    }
    
    agregarCapitulo(capitulo: Contenido){
        this.contenidos.push(capitulo);
    }

    obtenerCapitulo(capitulo: number) : Contenido{
        for (var i = 0; i < this.contenidos.length; i++) {
            if(i == capitulo){
                return this.contenidos[i];
            }
          }
    }

    cantidadDeCapitulos() : number {
        return this.contenidos.length;
    }

    primerCapitulo() : Contenido {
        return this.contenidos[0];
    }

    obtenerDuracion(titulo: Titulo): number{
        let duracionTotal: number = 0;
        if(titulo instanceof Serie){ 
            this.contenidos.forEach(element => {
                duracionTotal= duracionTotal+element.getDuracion();
            });
        }
        return duracionTotal;
    }


}

export class Usuario {
    private username: string;
    private region: Region;
    private titulosVistos: Array <Titulo>;
    private titulosActuales: Map<Titulo, [number, number]>;

    constructor (username: string, region: Region){
        this.username = username;
        this.region = region;
        this.titulosVistos = new Array();
        this.titulosActuales = new Map();
    }

    getUsername() : string{
        return this.username;
    }

    getRegion() : Region{
        return this.region;
    }

    getTitulosVistos() : Array<Titulo> {
        return this.titulosVistos;
    }
    getTitulosActuales() : Map<Titulo, [number, number]>{
        return this.titulosActuales;
    }

    
    ver (titulo: Titulo, tiempo_visualizado: number) : boolean{
        if(titulo.disponible(this.getRegion())){
            if(this.titulosActuales.has(titulo)){
                let capituloVisto = this.titulosActuales.get(titulo)[0];
                let duracionVistaHastaAhoraDelCapitulo = this.titulosActuales.get(titulo)[1];
                if (titulo instanceof Serie) {
                    while(titulo.getContenidos().length>capituloVisto && tiempo_visualizado+duracionVistaHastaAhoraDelCapitulo>= titulo.getContenidos()[capituloVisto].getDuracion()){
                        tiempo_visualizado=tiempo_visualizado+duracionVistaHastaAhoraDelCapitulo-titulo.getContenidos()[capituloVisto].getDuracion();
                        capituloVisto=capituloVisto+1;
                        duracionVistaHastaAhoraDelCapitulo=0;
                    }
                    this.titulosActuales.set(titulo,[capituloVisto, tiempo_visualizado+duracionVistaHastaAhoraDelCapitulo]);
                    if(titulo.getContenidos().length == capituloVisto && this.titulosActuales.get(titulo)[1]==0){
                        this.titulosActuales.delete(titulo);
                        this.titulosVistos.push(titulo);
                    }

                }
                else if(titulo instanceof Pelicula){
                    if(duracionVistaHastaAhoraDelCapitulo+tiempo_visualizado == titulo.getContenido().getDuracion()){
                        this.titulosActuales.delete(titulo);
                        this.titulosVistos.push(titulo);
                    }
                    else{
                        this.titulosActuales.set(titulo,[capituloVisto,duracionVistaHastaAhoraDelCapitulo+tiempo_visualizado]);
                    }
                }
            }
            else{
                this.titulosActuales.set(titulo,[0,tiempo_visualizado]);
                if(titulo instanceof Serie && tiempo_visualizado>= titulo.getContenidos()[0].getDuracion()){

                    this.ver(titulo,tiempo_visualizado);
                }
            }
        return true;
        }
        else{
            return false;
        }
                
}
    
    

    visto(titulo: Titulo) : boolean {
        if (this.titulosVistos.includes(titulo)){
                return true;
        }
        return false;
    }

    viendo(titulo: Titulo) : boolean {
        if (this.titulosActuales.has(titulo)){
            return true;
        }
        return false;;
    }

    capituloActual(serie: Titulo): number{
        if (this.viendo(serie)){
            return this.titulosActuales.get(serie)[0];
        }
        else {
            return 0;
        }   
    }
}

export class Sistema {
    private usuarios: Array<Usuario>;
    private titulos: Array<Titulo>;

    constructor (){
        this.usuarios = new Array();
        this.titulos = new Array();
    }
    
    agregarUsuario (usuario: Usuario): boolean{
        for (var i = 0; i < this.usuarios.length; i++) {
            if (this.usuarios[i].getUsername == usuario.getUsername) {
                return false;
            }
        }
        this.usuarios.push(usuario);
        return true;
    }

    agregarTitulo (titulo: Titulo): void{
        this.titulos.push(titulo);
    }

    buscarUsuario(nombre: string): Usuario{  
      for (var i = 0; i < this.usuarios.length; i++) {
            if (this.usuarios[i].getUsername() == nombre) {
                return this.usuarios[i];
            }
        }
    }

    buscarTitulo(nombre: string): Array<Titulo>{
        var titulosEncontrados: Array<Titulo>;
        for (var i = 0; i < this.titulos.length; i++) {
            if (this.titulos[i].getTitulo() == nombre) {
                titulosEncontrados.push(this.titulos[i]);
            }
        }
        return titulosEncontrados;
    }
}