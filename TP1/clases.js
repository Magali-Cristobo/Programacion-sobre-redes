"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Sistema = exports.Usuario = exports.Serie = exports.Contenido = exports.Pelicula = exports.Region = void 0;
var Region;
(function (Region) {
    Region[Region["AR"] = 0] = "AR";
    Region[Region["BR"] = 1] = "BR";
    Region[Region["CH"] = 2] = "CH";
})(Region = exports.Region || (exports.Region = {}));
var Titulo = /** @class */ (function () {
    function Titulo(titulo) {
        this.regiones = [];
        this.contenidos = [];
        this.titulo = titulo;
    }
    Titulo.prototype.getTitulo = function () {
        return this.titulo;
    };
    Titulo.prototype.setTitulo = function (nuevo) {
        this.titulo = nuevo;
    };
    Titulo.prototype.disponible = function (region) {
        return this.regiones.includes(region);
    };
    Titulo.prototype.agregarRegion = function (region) {
        this.regiones.push(region);
    };
    Titulo.prototype.quitarRegion = function (region) {
        var posicionRegion = this.regiones.indexOf(region); //obtengo el indice de esa region
        this.regiones.splice(posicionRegion, 1); //la saco del arreglo
    };
    Titulo.prototype.getDuracionTotal = function () {
        var duracion = 0;
        this.contenidos.forEach(function (contenidoActual) {
            duracion += contenidoActual.getDuracion();
        });
        return duracion;
    };
    Titulo.prototype.getContenidos = function () {
        return this.contenidos;
    };
    Titulo.prototype.getRegiones = function () {
        return this.regiones;
    };
    return Titulo;
}());
var Pelicula = /** @class */ (function (_super) {
    __extends(Pelicula, _super);
    function Pelicula(titulo) {
        return _super.call(this, titulo) || this;
    }
    Pelicula.prototype.setContenido = function (contenido) {
        this.getContenidos()[0] = contenido;
    };
    return Pelicula;
}(Titulo));
exports.Pelicula = Pelicula;
var Contenido = /** @class */ (function () {
    function Contenido(duracion) {
        this.duracion = duracion;
        this.date = new Date();
    }
    Contenido.prototype.getDate = function () {
        return this.date;
    };
    Contenido.prototype.getDuracion = function () {
        return this.duracion;
    };
    return Contenido;
}());
exports.Contenido = Contenido;
var Serie = /** @class */ (function (_super) {
    __extends(Serie, _super);
    function Serie(titulo) {
        return _super.call(this, titulo) || this;
    }
    Serie.prototype.agregarCapitulo = function (capitulo) {
        this.getContenidos().push(capitulo);
    };
    Serie.prototype.obtenerCapitulo = function (capitulo) {
        return this.getContenidos()[capitulo];
    };
    Serie.prototype.cantidadDeCapitulos = function () {
        return this.getContenidos().length;
    };
    Serie.prototype.primerCapitulo = function () {
        return this.getContenidos()[0];
    };
    return Serie;
}(Titulo));
exports.Serie = Serie;
var Usuario = /** @class */ (function () {
    function Usuario(username, region) {
        this.username = username;
        this.region = region;
        this.titulosVistos = [];
        this.titulosViendo = new Map();
    }
    Usuario.prototype.getUsername = function () {
        return this.username;
    };
    Usuario.prototype.getRegion = function () {
        return this.region;
    };
    Usuario.prototype.visto = function (titulo) {
        return this.titulosVistos.includes(titulo);
    };
    Usuario.prototype.viendo = function (titulo) {
        return this.titulosViendo.has(titulo);
    };
    Usuario.prototype.capituloActual = function (serie) {
        var capitulo = 0;
        if (this.getTitulosViendo().has(serie)) {
            capitulo = this.getTitulosViendo().get(serie)[0]; //podria retornar esto directamente, pero si no esta viendo la serie, va a dar error
        }
        return capitulo;
    };
    Usuario.prototype.ver = function (titulo, tiempoVisualizado) {
        var tiempoCapitulo = 0;
        var capitulo = 0;
        var tiempoVistoAnterior = 0;
        if (!titulo.getRegiones().includes(this.region)) {
            return false;
        }
        if (this.getTitulosViendo().has(titulo)) {
            capitulo = this.getTitulosViendo().get(titulo)[0];
            tiempoVistoAnterior = this.getTitulosViendo().get(titulo)[1];
        }
        if (titulo.getContenidos().length > 0) {
            for (var i = capitulo; tiempoVisualizado > 0; i++) {
                tiempoCapitulo = titulo.getContenidos()[i].getDuracion();
                if (tiempoVisualizado + tiempoVistoAnterior >= tiempoCapitulo) {
                    tiempoVisualizado = tiempoVisualizado + tiempoVistoAnterior - tiempoCapitulo;
                    tiempoVistoAnterior = 0;
                    this.getTitulosViendo().set(titulo, [i + 1, tiempoVisualizado]);
                }
                else {
                    this.getTitulosViendo().set(titulo, [i, tiempoVisualizado + tiempoVistoAnterior]);
                    tiempoVisualizado = 0;
                }
            }
        }
        if (this.getTitulosViendo().get(titulo)[0] > titulo.getContenidos().length - 1) { // si ya termino la serie/pelicula
            this.titulosVistos.push(titulo);
            this.titulosViendo["delete"](titulo);
        }
        return true;
    };
    Usuario.prototype.getTitulosViendo = function () {
        return this.titulosViendo;
    };
    Usuario.prototype.getTitulosVistos = function () {
        return this.titulosVistos;
    };
    return Usuario;
}());
exports.Usuario = Usuario;
var Sistema = /** @class */ (function () {
    function Sistema() {
        this.titulos = [];
        this.usuarios = [];
    }
    Sistema.prototype.agregarUsuario = function (usuario) {
        for (var i = 0; i < this.getUsuarios().length; i++) {
            if (this.getUsuarios()[i].getUsername() == usuario.getUsername()) {
                return false;
            }
        }
        this.getUsuarios().push(usuario);
        return true;
    };
    Sistema.prototype.agregarTitulo = function (titulo) {
        this.titulos.push(titulo);
    };
    Sistema.prototype.buscarUsuario = function (nombre) {
        for (var i = 0; i < this.getUsuarios().length; i++) {
            var usuarioActual = this.getUsuarios()[i];
            if (usuarioActual.getUsername() == nombre) {
                return usuarioActual;
            }
        }
        return new Usuario("", 0);
    };
    Sistema.prototype.buscarTitulo = function (nombre) {
        var titulos = [];
        for (var i = 0; i < this.getTitulos().length; i++) {
            var tituloActual = this.getTitulos()[i];
            if (tituloActual.getTitulo() == nombre) {
                titulos.push(tituloActual);
            }
        }
        return titulos;
    };
    Sistema.prototype.getUsuarios = function () {
        return this.usuarios;
    };
    Sistema.prototype.getTitulos = function () {
        return this.titulos;
    };
    return Sistema;
}());
exports.Sistema = Sistema;
