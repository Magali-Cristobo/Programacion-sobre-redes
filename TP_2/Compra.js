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
exports.Compra = void 0;
var Producto_1 = require("./Producto");
var Tabla_1 = require("./Tabla");
var Usuario_1 = require("./Usuario");
var Compra = /** @class */ (function (_super) {
    __extends(Compra, _super);
    function Compra(id, producto, cantidad, comprador, fecha, compradorCalificado, vendedorCalificado) {
        if (compradorCalificado === void 0) { compradorCalificado = false; }
        if (vendedorCalificado === void 0) { vendedorCalificado = false; }
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.producto = producto;
        _this.cantidad = cantidad;
        _this.comprador = comprador;
        _this.fecha = fecha;
        _this.compradorCalificado = compradorCalificado;
        _this.vendedorCalificado = vendedorCalificado;
        return _this;
    }
    Compra.prototype.getId = function () {
        return this.id;
    };
    Compra.prototype.setId = function (id) {
        this.id = id;
    };
    Compra.prototype.getProducto = function () {
        return this.producto;
    };
    Compra.prototype.setProducto = function (producto) {
        this.producto = producto;
    };
    Compra.prototype.getCantidad = function () {
        return this.cantidad;
    };
    Compra.prototype.setCantidad = function (cant) {
        this.cantidad = cant;
    };
    Compra.prototype.getComprador = function () {
        return this.comprador;
    };
    Compra.prototype.setComprador = function (comprador) {
        this.comprador = comprador;
    };
    Compra.prototype.getFecha = function () {
        return this.fecha;
    };
    Compra.prototype.setFecha = function (fecha) {
        this.fecha = fecha;
    };
    Compra.prototype.getCompradorCalificado = function () {
        return this.compradorCalificado;
    };
    Compra.prototype.setCompradorCalificado = function (compradorCalificado) {
        this.compradorCalificado = compradorCalificado;
    };
    Compra.prototype.getVendedorCalificado = function () {
        return this.vendedorCalificado;
    };
    Compra.prototype.setVendedorCalificado = function (vendedorCalificado) {
        this.vendedorCalificado = vendedorCalificado;
    };
    Compra.find = function (id) {
        return new Promise(function (resolve, reject) {
            Compra.crearConexion().query("SELECT * from compras where id=" + id, function (error, results) {
                return __awaiter(this, void 0, void 0, function () {
                    var compraEncontrada, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (error)
                                    reject(error);
                                if (!(results.length != 0)) return [3 /*break*/, 3];
                                _a = Compra.bind;
                                _b = [void 0, results[0].id];
                                return [4 /*yield*/, Producto_1.Producto.find(results[0].id_producto)];
                            case 1:
                                _b = _b.concat([_c.sent(), results[0].cantidad]);
                                return [4 /*yield*/, Usuario_1.Usuario.find(results[0].id_usuario)];
                            case 2:
                                compraEncontrada = new (_a.apply(Compra, _b.concat([_c.sent(), results[0].fecha, results[0].comprador_calificado, results[0].vendedor_calificado])))();
                                resolve(compraEncontrada);
                                return [3 /*break*/, 4];
                            case 3:
                                resolve(null);
                                _c.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            });
        });
    };
    Compra.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        Compra.crearConexion().query("select * from compras " + Compra.getQuery(), function (error, results, fields) {
                            if (error)
                                resolve(error);
                            var comprasEncontradas = new Array();
                            results.forEach(function (element) {
                                comprasEncontradas.push(new Compra(element.id, element.id_producto, element.cantidad, element.id_usuario, element.fecha, element.comprador_calificado, element.vendedor_calificado));
                            });
                            Compra.borrarQuery();
                            resolve(comprasEncontradas);
                        });
                    })];
            });
        });
    };
    Compra.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var id, idComprador, cantidad, fecha, idProducto, vendedorCalificado, compradorCalificado;
            return __generator(this, function (_a) {
                id = this.getId();
                idComprador = this.getComprador().getId();
                cantidad = this.getCantidad();
                fecha = this.getFecha();
                idProducto = this.getProducto().getId();
                vendedorCalificado = this.getVendedorCalificado();
                compradorCalificado = this.getCompradorCalificado();
                if (id == 0) { // si el id es 0 la compra no esta en la base
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            Compra.crearConexion().query("Insert into compras values(null," + idComprador + "," + idProducto + "," + cantidad + ", \"" + fecha + "\", 0, 0)", function (error, results) {
                                if (error)
                                    resolve(error);
                                else
                                    resolve('Compra realizada');
                            });
                        })];
                }
                else {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            Compra.crearConexion().query("update compras set id_usuario=" + idComprador + ", cantidad=" + cantidad + ", id_producto=" + idProducto + ", comprador_calificado=" + compradorCalificado + " , vendedor_calificado=" + vendedorCalificado + " where id=" + id, function (error, results) {
                                if (error)
                                    resolve(error);
                                else
                                    resolve('Compra actualizada');
                            });
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    return Compra;
}(Tabla_1.Tabla));
exports.Compra = Compra;
