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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Favorito = void 0;
var Tabla_1 = require("./Tabla");
var Favorito = /** @class */ (function (_super) {
    __extends(Favorito, _super);
    function Favorito(id, usuario, producto) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.usuario = usuario;
        _this.producto = producto;
        return _this;
    }
    Favorito.prototype.getId = function () {
        return this.id;
    };
    Favorito.prototype.getUsuario = function () {
        return this.usuario;
    };
    Favorito.prototype.getProducto = function () {
        return this.producto;
    };
    Favorito.prototype.setId = function (value) {
        this.id = value;
    };
    Favorito.prototype.setUsuario = function (value) {
        this.usuario = value;
    };
    Favorito.prototype.setProducto = function (value) {
        this.producto = value;
    };
    Favorito.find = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        Favorito.crearConexion().query("SELECT * from favoritos where id=" + id, function (error, results) {
                            if (error)
                                reject(error);
                            if (results.length != 0) {
                                var favoritoEncontrado = new Favorito(results[0].id, results[0].id_usuario, results[0].id_producto);
                                resolve(favoritoEncontrado);
                            }
                            else {
                                resolve(null); //retorna null si no lo encuentra
                            }
                        });
                    })];
            });
        });
    };
    Favorito.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        Favorito.crearConexion().query("select * from favoritos " + Favorito.getQuery(), function (error, results, fields) {
                            if (error)
                                resolve(error);
                            var favoritoEncontrados = new Array();
                            results.forEach(function (element) {
                                favoritoEncontrados.push(new Favorito(element.id, element.id_usuario, element.id_producto));
                            });
                            Favorito.borrarQuery();
                            resolve(favoritoEncontrados);
                        });
                    })];
            });
        });
    };
    Favorito.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var idUsuario, idProducto;
            return __generator(this, function (_a) {
                console.log("this ", this);
                console.log("usuario", this.getUsuario());
                idUsuario = this.getUsuario().getId();
                idProducto = this.getProducto().getId();
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        Favorito.crearConexion().query("Insert into favoritos values(null," + idUsuario + "," + idProducto + ")", function (error, results) {
                            if (error)
                                resolve(error);
                            else
                                resolve('Favorito insertado');
                        });
                    })];
            });
        });
    };
    return Favorito;
}(Tabla_1.Tabla));
exports.Favorito = Favorito;
