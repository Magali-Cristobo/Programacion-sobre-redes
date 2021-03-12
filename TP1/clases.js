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
    Titulo.prototype.setTitulo = function (tituloNuevo) {
        this.titulo = tituloNuevo;
    };
    Titulo.prototype.disponible = function (region) {
        return this.regiones.includes(region);
    };
    Titulo.prototype.agregarRegion = function (region) {
        this.regiones.push(region);
    };
    Titulo.prototype.quitarRegion = function (region) {
        var posicionRegion = this.regiones.indexOf(region);
        this.regiones.splice(posicionRegion, 1);
    };
    Titulo.prototype.getDuracionTotal = function () {
        var duracion = 0;
        this.contenidos.forEach(function (contenidoActual) {
            duracion += contenidoActual.getDuracion();
        });
        return duracion;
    };
    return Titulo;
}());
var Pelicula = /** @class */ (function (_super) {
    __extends(Pelicula, _super);
    function Pelicula(titulo) {
        return _super.call(this, titulo) || this;
    }
    Pelicula.prototype.setContenido = function (contenido) {
        this.contenidos[0] = contenido;
    };
    Pelicula.prototype.getContenido = function () {
        return this.contenidos[0];
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
        this.contenidos.push(capitulo);
    };
    Serie.prototype.obtenerCapitulo = function (capitulo) {
        return this.contenidos[capitulo];
    };
    Serie.prototype.cantidadDeCapitulos = function () {
        return this.contenidos.length;
    };
    Serie.prototype.primerCapitulo = function () {
        return this.contenidos[0];
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
        return this.region; // me tira la pos del enum (0,1,2) no AR, BR, o CH
    };
    Usuario.prototype.visto = function (titulo) {
        return this.titulosVistos.includes(titulo);
    };
    Usuario.prototype.viendo = function (titulo) {
        return this.titulosViendo.has(titulo);
    };
    Usuario.prototype.capituloActual = function (serie) {
        var capitulo = 0;
        var tiempoVistoSerie = this.titulosViendo.get(serie);
        for (var i = 0; i < serie.contenidos.length; i++) {
            if (serie.contenidos[i].getDuracion() > tiempoVistoSerie) {
                return capitulo;
            }
            tiempoVistoSerie -= serie.contenidos[i].getDuracion();
            capitulo++;
        }
        return 0;
    };
    Usuario.prototype.ver = function (titulo, tiempo_visualizado) {
        var tiempoVistoAnterior = 0;
        if (!titulo.regiones.includes(this.region)) {
            return false;
        }
        if (this.titulosViendo.has(titulo)) {
            tiempoVistoAnterior = this.titulosViendo.get(titulo);
        }
        if (titulo.getDuracionTotal() <= tiempo_visualizado + tiempoVistoAnterior) {
            this.titulosVistos.push(titulo);
            this.titulosViendo["delete"](titulo);
        }
        else {
            this.titulosViendo.set(titulo, tiempo_visualizado + tiempoVistoAnterior);
        }
        return true;
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
        this.usuarios.push(usuario);
    };
    Sistema.prototype.agregarTitulo = function (titulo) {
        this.titulos.push(titulo);
    };
    return Sistema;
}());
exports.Sistema = Sistema;
