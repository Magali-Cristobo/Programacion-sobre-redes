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
exports.Sistema = exports.Usuario = exports.Serie = exports.Pelicula = exports.Titulo = exports.Contenido = exports.Region = void 0;
var Region;
(function (Region) {
    Region[Region["AR"] = 0] = "AR";
    Region[Region["BR"] = 1] = "BR";
    Region[Region["CH"] = 2] = "CH";
})(Region = exports.Region || (exports.Region = {}));
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
var Titulo = /** @class */ (function () {
    function Titulo(titulo) {
        this.titulo = titulo;
        this.regionesDisponibles = new Array;
    }
    Titulo.prototype.getRegionesDisponibles = function () {
        return this.regionesDisponibles;
    };
    Titulo.prototype.getTitulo = function () {
        return this.titulo;
    };
    Titulo.prototype.setTitulo = function (nuevo) {
        this.titulo = nuevo;
    };
    Titulo.prototype.disponible = function (region) {
        for (var _i = 0, _a = this.regionesDisponibles; _i < _a.length; _i++) {
            var regionDisponible = _a[_i];
            if (regionDisponible == region) {
                return true;
            }
        }
        return false;
    };
    Titulo.prototype.agregarRegion = function (region) {
        this.regionesDisponibles.push(region);
    };
    Titulo.prototype.quitarRegion = function (region) {
        var _this = this;
        this.regionesDisponibles.forEach(function (item, index) {
            if (item === region)
                _this.regionesDisponibles.splice(index, 1);
        });
    };
    return Titulo;
}());
exports.Titulo = Titulo;
var Pelicula = /** @class */ (function (_super) {
    __extends(Pelicula, _super);
    function Pelicula(titulo) {
        return _super.call(this, titulo) || this;
    }
    Pelicula.prototype.getContenido = function () {
        return this.contenido;
    };
    Pelicula.prototype.setContenido = function (contenido) {
        this.contenido = contenido;
    };
    return Pelicula;
}(Titulo));
exports.Pelicula = Pelicula;
var Serie = /** @class */ (function (_super) {
    __extends(Serie, _super);
    function Serie(titulo) {
        var _this = _super.call(this, titulo) || this;
        _this.contenidos = new Array();
        return _this;
    }
    Serie.prototype.getContenidos = function () {
        return this.contenidos;
    };
    Serie.prototype.agregarCapitulo = function (capitulo) {
        this.contenidos.push(capitulo);
    };
    Serie.prototype.obtenerCapitulo = function (capitulo) {
        for (var i = 0; i < this.contenidos.length; i++) {
            if (i == capitulo) {
                return this.contenidos[i];
            }
        }
    };
    Serie.prototype.cantidadDeCapitulos = function () {
        return this.contenidos.length;
    };
    Serie.prototype.primerCapitulo = function () {
        return this.contenidos[0];
    };
    Serie.prototype.obtenerDuracion = function (titulo) {
        var duracionTotal = 0;
        if (titulo instanceof Serie) {
            this.contenidos.forEach(function (element) {
                duracionTotal = duracionTotal + element.getDuracion();
            });
        }
        return duracionTotal;
    };
    return Serie;
}(Titulo));
exports.Serie = Serie;
var Usuario = /** @class */ (function () {
    function Usuario(username, region) {
        this.username = username;
        this.region = region;
        this.titulosVistos = new Array();
        this.titulosActuales = new Map();
    }
    Usuario.prototype.getUsername = function () {
        return this.username;
    };
    Usuario.prototype.getRegion = function () {
        return this.region;
    };
    Usuario.prototype.getTitulosVistos = function () {
        return this.titulosVistos;
    };
    Usuario.prototype.getTitulosActuales = function () {
        return this.titulosActuales;
    };
    Usuario.prototype.ver = function (titulo, tiempo_visualizado) {
        if (titulo.disponible(this.getRegion())) {
            if (this.titulosActuales.has(titulo)) {
                var capituloVisto = this.titulosActuales.get(titulo)[0];
                var duracionVistaHastaAhoraDelCapitulo = this.titulosActuales.get(titulo)[1];
                if (titulo instanceof Serie) {
                    while (titulo.getContenidos().length > capituloVisto && tiempo_visualizado + duracionVistaHastaAhoraDelCapitulo >= titulo.getContenidos()[capituloVisto].getDuracion()) {
                        tiempo_visualizado = tiempo_visualizado + duracionVistaHastaAhoraDelCapitulo - titulo.getContenidos()[capituloVisto].getDuracion();
                        capituloVisto = capituloVisto + 1;
                        duracionVistaHastaAhoraDelCapitulo = 0;
                    }
                    this.titulosActuales.set(titulo, [capituloVisto, tiempo_visualizado + duracionVistaHastaAhoraDelCapitulo]);
                    if (titulo.getContenidos().length == capituloVisto && this.titulosActuales.get(titulo)[1] == 0) {
                        this.titulosActuales["delete"](titulo);
                        this.titulosVistos.push(titulo);
                    }
                }
                else if (titulo instanceof Pelicula) {
                    if (duracionVistaHastaAhoraDelCapitulo + tiempo_visualizado == titulo.getContenido().getDuracion()) {
                        this.titulosActuales["delete"](titulo);
                        this.titulosVistos.push(titulo);
                    }
                    else {
                        this.titulosActuales.set(titulo, [capituloVisto, duracionVistaHastaAhoraDelCapitulo + tiempo_visualizado]);
                    }
                }
            }
            else {
                this.titulosActuales.set(titulo, [0, tiempo_visualizado]);
                if (titulo instanceof Serie && tiempo_visualizado >= titulo.getContenidos()[0].getDuracion()) {
                    this.ver(titulo, tiempo_visualizado);
                }
            }
            return true;
        }
        else {
            return false;
        }
    };
    Usuario.prototype.visto = function (titulo) {
        if (this.titulosVistos.includes(titulo)) {
            return true;
        }
        return false;
    };
    Usuario.prototype.viendo = function (titulo) {
        if (this.titulosActuales.has(titulo)) {
            return true;
        }
        return false;
        ;
    };
    Usuario.prototype.capituloActual = function (serie) {
        if (this.viendo(serie)) {
            return this.titulosActuales.get(serie)[0];
        }
        else {
            return 0;
        }
    };
    return Usuario;
}());
exports.Usuario = Usuario;
var Sistema = /** @class */ (function () {
    function Sistema() {
        this.usuarios = new Array();
        this.titulos = new Array();
    }
    Sistema.prototype.agregarUsuario = function (usuario) {
        for (var i = 0; i < this.usuarios.length; i++) {
            if (this.usuarios[i].getUsername == usuario.getUsername) {
                return false;
            }
        }
        this.usuarios.push(usuario);
        return true;
    };
    Sistema.prototype.agregarTitulo = function (titulo) {
        this.titulos.push(titulo);
    };
    Sistema.prototype.buscarUsuario = function (nombre) {
        for (var i = 0; i < this.usuarios.length; i++) {
            if (this.usuarios[i].getUsername() == nombre) {
                return this.usuarios[i];
            }
        }
    };
    Sistema.prototype.buscarTitulo = function (nombre) {
        var titulosEncontrados;
        for (var i = 0; i < this.titulos.length; i++) {
            if (this.titulos[i].getTitulo() == nombre) {
                titulosEncontrados.push(this.titulos[i]);
            }
        }
        return titulosEncontrados;
    };
    return Sistema;
}());
exports.Sistema = Sistema;
