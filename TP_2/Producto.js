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
exports.Producto = void 0;
var Tabla_1 = require("./Tabla");
var Producto = /** @class */ (function (_super) {
    __extends(Producto, _super);
    function Producto(id, idVendedor, nombre, precio, stock, usado) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.idVendedor = idVendedor;
        _this.nombre = nombre;
        _this.precio = precio;
        _this.stock = stock;
        _this.usado = usado;
        return _this;
    }
    Producto.prototype.getPrecio = function () {
        return this.precio;
    };
    Producto.prototype.getVendedor = function () {
        return this.idVendedor;
    };
    Producto.prototype.getId = function () {
        return this.id;
    };
    Producto.prototype.getNombre = function () {
        return this.nombre;
    };
    Producto.prototype.getStock = function () {
        return this.stock;
    };
    Producto.prototype.getUsado = function () {
        return this.usado;
    };
    Producto.prototype.setId = function (value) {
        this.id = value;
    };
    Producto.prototype.setIdVendedor = function (idVendedor) {
        this.idVendedor = idVendedor;
    };
    Producto.prototype.setNombre = function (nombre) {
        this.nombre = nombre;
    };
    Producto.prototype.setPrecio = function (precio) {
        this.precio = precio;
    };
    Producto.prototype.setStock = function (value) {
        this.stock = value;
    };
    Producto.prototype.setUsado = function (usado) {
        this.usado = usado;
    };
    Producto.find = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        Producto.crearConexion().query("SELECT * from productos where id=" + id, function (error, results) {
                            if (error)
                                reject(error);
                            if (results.length != 0) {
                                var productoEncontrado = new Producto(results[0].id, results[0].vendedor, results[0].nombre, results[0].precio, results[0].stock, results[0].usado);
                                resolve(productoEncontrado);
                            }
                            else {
                                resolve(null); //retorna nulo si no lo encuentra
                            }
                        });
                    })];
            });
        });
    };
    Producto.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        Producto.crearConexion().query("select productos.id, productos.nombre, stock, usado, vendedor, precio, usado from productos left join usuarios on usuarios.id=vendedor " + Producto.getQuery(), function (error, results, fields) {
                            if (error)
                                resolve(error);
                            var productosEncontrados = new Array();
                            results.forEach(function (element) {
                                productosEncontrados.push(new Producto(element.id, element.vendedor, element.nombre, element.precio, element.stock, element.usado));
                            });
                            Producto.borrarQuery();
                            resolve(productosEncontrados);
                        });
                    })];
            });
        });
    };
    Producto.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var id, idVendedor, nombre, precio, stock, usado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = this.getId();
                        idVendedor = this.getVendedor();
                        nombre = this.getNombre();
                        precio = this.getPrecio();
                        stock = this.getStock();
                        usado = this.getUsado();
                        console.log(stock);
                        return [4 /*yield*/, Producto.find(id)];
                    case 1:
                        if ((_a.sent()) == null) { //si el producto no existe hacemos insert
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    Producto.crearConexion().query("Insert into productos values(null," + id + "," + idVendedor + ",\"" + nombre + "\"," + precio + ", " + stock + ", " + usado + ")", function (error, results) {
                                        if (error)
                                            resolve(error);
                                        else
                                            resolve('Producto agregado');
                                    });
                                })];
                        }
                        else {
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    Producto.crearConexion().query("update productos set vendedor=" + idVendedor + ", nombre=\"" + nombre + "\", precio=" + precio + ", stock=" + stock + ", usado=" + usado + " where id=" + id, function (error, results) {
                                        if (error)
                                            resolve(error);
                                        else
                                            resolve('Producto actualizado');
                                    });
                                })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Producto;
}(Tabla_1.Tabla));
exports.Producto = Producto;
