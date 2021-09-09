"use strict";
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
var Compra_1 = require("./Compra");
var Producto_1 = require("./Producto");
var Usuario_1 = require("./Usuario");
var CalificacionVendedor_1 = require("./CalificacionVendedor");
var CalificacionComprador_1 = require("./CalificacionComprador");
var Favorito_1 = require("./Favorito");
var express = require('express');
var bp = require('body-parser');
var app = express();
var port = 3000;
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.listen(port, function () {
    console.log("App listening at http://localhost:" + port);
});
function fechaActual() {
    var date;
    date = new Date();
    date = date.getUTCFullYear() + '-' + ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' +
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);
    return date;
}
app.get('/productos', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jsonObject, map, productos, value;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jsonObject = req.query;
                map = new Map();
                for (value in jsonObject) {
                    if (value != "orden") {
                        map.set(value, jsonObject[value]);
                    }
                }
                if (jsonObject["orden"] != null) { //hacemos esto porque orden tiene que estar al final de la query
                    map.set("orden", jsonObject["orden"]);
                }
                map.forEach(function (value, key) {
                    switch (key) {
                        case "busqueda":
                            productos = Producto_1.Producto.where("nombre ", "like ", "'" + "%" + (req.query.busqueda) + "%" + "'");
                            break;
                        case "usado":
                            productos = Producto_1.Producto.where("usado", "=", req.query.usado);
                            break;
                        case "orden":
                            if (value == "precio") {
                                productos = Producto_1.Producto.orderBy("precio", " ASC");
                            }
                            else {
                                productos = Producto_1.Producto.orderBy("calificacion_vendedor", " DESC");
                            }
                            break;
                    }
                });
                return [4 /*yield*/, Producto_1.Producto.get()];
            case 1:
                productos = _a.sent();
                res.json(productos);
                return [2 /*return*/];
        }
    });
}); });
app.get('/usuarios/:id/fav', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var usuarioEncontrado, productos, favoritos, promesa;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Usuario_1.Usuario.find(req.params.id)];
            case 1:
                usuarioEncontrado = _a.sent();
                productos = [];
                favoritos = [];
                if (usuarioEncontrado != null) {
                    favoritos = usuarioEncontrado.getFavoritos();
                    promesa = new Promise(function (resolve, reject) {
                        return __awaiter(this, void 0, void 0, function () {
                            var i, _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        i = 0;
                                        _c.label = 1;
                                    case 1:
                                        if (!(i < favoritos.length)) return [3 /*break*/, 4];
                                        _b = (_a = productos).push;
                                        return [4 /*yield*/, Producto_1.Producto.find(favoritos[i].producto)];
                                    case 2:
                                        _b.apply(_a, [_c.sent()]);
                                        _c.label = 3;
                                    case 3:
                                        i++;
                                        return [3 /*break*/, 1];
                                    case 4:
                                        resolve(productos);
                                        return [2 /*return*/];
                                }
                            });
                        });
                    });
                    promesa.then(function (resultado) {
                        res.json(resultado);
                    });
                }
                else {
                    res.json("No existe el usuario");
                }
                return [2 /*return*/];
        }
    });
}); });
app.post('/usuarios/:id/fav', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var usuario, producto, favorito;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Usuario_1.Usuario.find(req.params.id)];
            case 1:
                usuario = _a.sent();
                return [4 /*yield*/, Producto_1.Producto.find(req.body.id_producto)];
            case 2:
                producto = _a.sent();
                favorito = new Favorito_1.Favorito(0, usuario, producto);
                if (!(usuario != null)) return [3 /*break*/, 4];
                return [4 /*yield*/, favorito.save()];
            case 3:
                _a.sent();
                res.send("Favorito agregado correctamente");
                return [3 /*break*/, 5];
            case 4:
                res.send("El usuario no existe");
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
app["delete"]('/usuarios/:id/fav', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Usuario_1.Usuario.crearConexion().query("Delete from favoritos where id_usuario=" + req.params.id + " and id_producto=" + req.body.id_producto, function (error, results) {
                    if (error)
                        res.send("No se ha podido eliminar el producto de favoritos");
                    else
                        res.send('Eliminado de favoritos correctamente');
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
app.get('/usuarios/:id/compras', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var compras, promesa;
    return __generator(this, function (_a) {
        compras = [];
        promesa = new Promise(function (resolve, reject) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Compra_1.Compra.where("id_usuario", "=", req.params.id).get()];
                        case 1:
                            compras = _a.sent();
                            resolve(compras);
                            return [2 /*return*/];
                    }
                });
            });
        });
        promesa.then(function (compras) {
            res.json(compras);
        });
        return [2 /*return*/];
    });
}); });
app.post('/usuarios/:id/compras', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var producto, comprador, compra, vendedor, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, Producto_1.Producto.find(req.body.id_producto)];
            case 1:
                producto = _c.sent();
                return [4 /*yield*/, Usuario_1.Usuario.find(req.params.id)];
            case 2:
                comprador = _c.sent();
                if (!(producto != null && comprador != null && req.body.cantidad <= producto.getStock() && comprador.getSaldo() >= (producto.getPrecio() * req.body.cantidad))) return [3 /*break*/, 8];
                compra = new Compra_1.Compra(0, producto, req.body.cantidad, comprador, fechaActual());
                return [4 /*yield*/, Usuario_1.Usuario.find(producto.getVendedor())];
            case 3:
                vendedor = _c.sent();
                // let vendedor= new Usuario(vendedorEncontrado["id"], vendedorEncontrado["username"], vendedorEncontrado["saldo"], vendedorEncontrado["calificacionVendedor"],vendedorEncontrado["calificacionComprador"]);
                //disminuimos el stock, el saldo del vendedor y le sumamos saldo al vendedor
                producto.setStock(producto.getStock() - req.body.cantidad);
                comprador.setSaldo(comprador.getSaldo() - producto.getPrecio());
                vendedor.setSaldo(vendedor.getSaldo() + producto.getPrecio());
                return [4 /*yield*/, producto.save()];
            case 4:
                _c.sent();
                return [4 /*yield*/, comprador.save()];
            case 5:
                _c.sent();
                return [4 /*yield*/, vendedor.save()];
            case 6:
                _c.sent();
                _b = (_a = res).send;
                return [4 /*yield*/, compra.save()];
            case 7:
                _b.apply(_a, [_c.sent()]);
                return [3 /*break*/, 9];
            case 8:
                res.send("No se pudo realizar la compra");
                _c.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); });
app.get('/usuarios/:id/calificaciones', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var calificaciones, calificacionesVendedor, calificacionesComprador;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                calificaciones = [];
                return [4 /*yield*/, CalificacionVendedor_1.CalificacionVendedor.where("id_vendedor", "=", req.params.id).get()];
            case 1:
                calificacionesVendedor = _a.sent();
                return [4 /*yield*/, CalificacionComprador_1.CalificacionComprador.where("id_comprador", "=", req.params.id).get()];
            case 2:
                calificacionesComprador = _a.sent();
                calificacionesVendedor.forEach(function (element) {
                    calificaciones.push(element);
                });
                calificacionesComprador.forEach(function (element) {
                    calificaciones.push(element);
                });
                res.json(calificaciones);
                return [2 /*return*/];
        }
    });
}); });
app.post('/usuarios/:id/calificaciones', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var compra, producto, vendedor, comprador, calificacion, promedio, calificacion, promedio;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Compra_1.Compra.find(req.body.id_operacion)];
            case 1:
                compra = _a.sent();
                producto = compra.getProducto();
                console.log(producto.getVendedor());
                return [4 /*yield*/, Usuario_1.Usuario.find(producto.getVendedor())];
            case 2:
                vendedor = _a.sent();
                comprador = compra.getComprador();
                if (!(producto != null && vendedor != null && comprador != null)) return [3 /*break*/, 13];
                if (!(req.body.id_calificante == comprador.getId() && !compra.getVendedorCalificado())) return [3 /*break*/, 6];
                compra.setVendedorCalificado(true);
                calificacion = new CalificacionComprador_1.CalificacionComprador(fechaActual(), 0, req.body.calificacion, vendedor, comprador);
                return [4 /*yield*/, calificacion.save()];
            case 3:
                _a.sent();
                return [4 /*yield*/, vendedor.obtenerPromedioVendedor()];
            case 4:
                promedio = _a.sent();
                vendedor.setCalificacionVendedor(promedio);
                return [4 /*yield*/, vendedor.save()];
            case 5:
                _a.sent();
                res.json("Comprador califico a vendedor exitosamente");
                return [3 /*break*/, 11];
            case 6:
                if (!!compra.getCompradorCalificado()) return [3 /*break*/, 10];
                compra.setCompradorCalificado(true);
                calificacion = new CalificacionVendedor_1.CalificacionVendedor(fechaActual(), 0, req.body.calificacion, vendedor, comprador);
                return [4 /*yield*/, calificacion.save()];
            case 7:
                _a.sent();
                return [4 /*yield*/, comprador.obtenerPromedioComprador()];
            case 8:
                promedio = _a.sent();
                comprador.setCalificacionComprador(promedio);
                return [4 /*yield*/, comprador.save()];
            case 9:
                _a.sent();
                res.json("Vendedor califico a comprador exitosamente");
                return [3 /*break*/, 11];
            case 10:
                res.json("ya esta calificado");
                _a.label = 11;
            case 11: return [4 /*yield*/, compra.save()];
            case 12:
                _a.sent();
                return [3 /*break*/, 14];
            case 13:
                res.send("Error Los datos no coinciden con nuestra base");
                _a.label = 14;
            case 14: return [2 /*return*/];
        }
    });
}); });
