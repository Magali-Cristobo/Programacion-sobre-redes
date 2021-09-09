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
exports.Calificacion = void 0;
var Tabla_1 = require("./Tabla");
var Calificacion = /** @class */ (function (_super) {
    __extends(Calificacion, _super);
    function Calificacion(fecha, id, calificacion, vendedor, comprador) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.fecha = fecha;
        _this.calificacion = calificacion;
        _this.vendedor = vendedor;
        _this.comprador = comprador;
        return _this;
    }
    Calificacion.prototype.getFecha = function () {
        return this.fecha;
    };
    Calificacion.prototype.getId = function () {
        return this.id;
    };
    Calificacion.prototype.getCalificacion = function () {
        return this.calificacion;
    };
    Calificacion.prototype.getVendedor = function () {
        return this.vendedor;
    };
    Calificacion.prototype.getComprador = function () {
        return this.comprador;
    };
    Calificacion.prototype.setFecha = function (fecha) {
        this.fecha = fecha;
    };
    Calificacion.prototype.setCalificacion = function (calificacion) {
        this.calificacion = calificacion;
    };
    Calificacion.prototype.setComprador = function (comprador) {
        this.comprador = comprador;
    };
    Calificacion.prototype.setId = function (id) {
        this.id = id;
    };
    Calificacion.prototype.setVendedor = function (vendedor) {
        this.vendedor = vendedor;
    };
    return Calificacion;
}(Tabla_1.Tabla));
exports.Calificacion = Calificacion;
