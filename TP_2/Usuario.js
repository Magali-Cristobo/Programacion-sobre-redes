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
exports.Usuario = void 0;
var Tabla_1 = require("./Tabla");
var Favorito_1 = require("./Favorito");
var Usuario = /** @class */ (function (_super) {
    __extends(Usuario, _super);
    function Usuario(id, username, saldo, calificacionVendedor, calificacionComprador, fav) {
        if (fav === void 0) { fav = []; }
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.username = username;
        _this.saldo = saldo;
        _this.calificacionVendedor = calificacionVendedor;
        _this.calificacionComprador = calificacionComprador;
        _this.favoritos = fav;
        Usuario.query = " ";
        return _this;
    }
    Usuario.prototype.getSaldo = function () {
        return this.saldo;
    };
    Usuario.prototype.setSaldo = function (saldo) {
        this.saldo = saldo;
    };
    Usuario.prototype.getId = function () {
        return this.id;
    };
    Usuario.prototype.setId = function (value) {
        this.id = value;
    };
    Usuario.prototype.getUsername = function () {
        return this.username;
    };
    Usuario.prototype.getFavoritos = function () {
        return this.favoritos;
    };
    Usuario.prototype.setUsername = function (value) {
        this.username = value;
    };
    Usuario.prototype.setFavoritos = function (value) {
        this.favoritos = value;
    };
    Usuario.prototype.getCalificacionVendedor = function () {
        return this.calificacionVendedor;
    };
    Usuario.prototype.setCalificacionVendedor = function (value) {
        this.calificacionVendedor = value;
    };
    Usuario.prototype.getCalificacionComprador = function () {
        return this.calificacionComprador;
    };
    Usuario.prototype.setCalificacionComprador = function (value) {
        this.calificacionComprador = value;
    };
    Usuario.find = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        return __awaiter(this, void 0, void 0, function () {
                            var favoritos;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        favoritos = new Array();
                                        return [4 /*yield*/, Favorito_1.Favorito.where("id_usuario", "=", "" + id + "").get()];
                                    case 1:
                                        // Usuario.crearConexion().query(`SELECT id_producto FROM favoritos where id_usuario=${id}`, function (error, results) {
                                        //     if(error) reject(error);
                                        //     results.forEach(element => { // recorre todos los favoritos y los pone en un array 
                                        //         favoritos.push(element.id_producto);
                                        //     });
                                        // });
                                        favoritos = _a.sent();
                                        Usuario.crearConexion().query("SELECT * from usuarios where id=" + id, function (error, results) {
                                            if (error)
                                                reject(error);
                                            if (results.length != 0) {
                                                var usuarioEncontrado = new Usuario(results[0].id, results[0].username, results[0].saldo, results[0].calificacion_vendedor, results[0].calificacion_comprador, favoritos);
                                                // usuarioEncontrado.setFavoritos(favoritos);
                                                resolve(usuarioEncontrado);
                                            }
                                            else {
                                                resolve(null); //si no encuentra nada retorna null
                                            }
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        });
                    })];
            });
        });
    };
    Usuario.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                Usuario.crearConexion().query("select * from usuarios " + Usuario.getQuery(), function (error, results, fields) {
                                    var _this = this;
                                    if (error)
                                        reject(error);
                                    var usuariosEncontrados = new Array();
                                    results.forEach(function (element) { return __awaiter(_this, void 0, void 0, function () {
                                        var favoritos;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    favoritos = new Array();
                                                    return [4 /*yield*/, Favorito_1.Favorito.where("id_usuario", "=", "" + element.id + "").get()];
                                                case 1:
                                                    favoritos = _a.sent();
                                                    usuariosEncontrados.push(new Usuario(element.id, element.username, element.usuario, element.calificacion_vendedor, element.calificacion_comprador, favoritos));
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    Usuario.borrarQuery();
                                    resolve(usuariosEncontrados);
                                });
                                return [2 /*return*/];
                            });
                        });
                    })];
            });
        });
    };
    Usuario.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var id, username, saldo, calificacionVendedor, calificacionComprador, favoritos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = this.getId();
                        username = this.getUsername();
                        saldo = this.getSaldo();
                        calificacionVendedor = this.getCalificacionVendedor();
                        calificacionComprador = this.getCalificacionComprador();
                        favoritos = this.getFavoritos();
                        return [4 /*yield*/, Usuario.find(id)];
                    case 1:
                        if ((_a.sent()) == null) { //si el usuario no existe hacemos inserts
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    Usuario.crearConexion().query("Insert into usuarios values(null," + id + ",\"" + username + "\"," + calificacionVendedor + "," + calificacionComprador + ")", function (error, results) {
                                        if (error)
                                            resolve(error);
                                        else
                                            resolve('Usuario agregado');
                                    });
                                    for (var i = 0; i < favoritos.length; i++) {
                                        Usuario.crearConexion().query("Insert into favoritos values(null," + id + "," + favoritos[i] + ")", function (error, results) {
                                            if (error)
                                                resolve(error);
                                            else
                                                resolve('Favorito agregado');
                                        });
                                    }
                                })];
                        }
                        else { // para hacer el update le mandamos todos los atributos siempre
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    Usuario.crearConexion().query("update usuarios set username=\"" + username + "\", saldo=" + saldo + ", calificacion_vendedor=" + calificacionVendedor + ",calificacion_comprador=" + calificacionComprador + " where id=" + id, function (error, results) {
                                        if (error)
                                            reject(error);
                                        else
                                            resolve('Usuario actualizado');
                                    });
                                })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Usuario.prototype.obtenerPromedioVendedor = function () {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                id = this.getId();
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        Usuario.crearConexion().query("select avg(calificacion) as promedio from calificaciones_compradores where id_vendedor=" + id, function (error, results) {
                            if (error)
                                throw (error);
                            resolve(results[0].promedio);
                        });
                    })];
            });
        });
    };
    Usuario.prototype.obtenerPromedioComprador = function () {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                id = this.getId();
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        Usuario.crearConexion().query("select avg(calificacion) as promedio from calificaciones_vendedores where id_comprador=" + id, function (error, results) {
                            if (error)
                                throw (error);
                            resolve(results[0].promedio);
                        });
                    })];
            });
        });
    };
    return Usuario;
}(Tabla_1.Tabla));
exports.Usuario = Usuario;
