export abstract class Tabla{
    protected static query:string=" ";

    static crearConexion(){
        let mysql = require('mysql');
        let connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : '',
            database : 'ecommerce'
        });
        return connection;
    }
    
    static borrarQuery(){
        this.query=" ";
    }
    static getQuery():string{
        return this.query;
    }

    // metodos de la clase
    public async find(id: number){
        return null;
    }

    public save(objeto: Object){
        return null;
    }

    static where(columna:string, comparador:string, valor:string){
        if(this.getQuery().includes("where")){ //si ya hay un where pone and
            this.query+=" and ";
            this.query+=columna;
            this.query+=comparador;
            this.query+=valor; 
        }
        else{
            this.query+="where ";
            this.query+=columna;
            this.query+=comparador;
            this.query+=valor; 
        }
        return this;
    }

    static orderBy(columna:string, orden:string){
        this.query+=" order by ";
        this.query+=columna;
        this.query+=orden;
        return this;
    }

    static async get(){
        return null;
    }
}