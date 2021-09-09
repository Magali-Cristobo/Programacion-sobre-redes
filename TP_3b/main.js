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
var express = require('express');
var bp = require('body-parser');
// const cluster = require('cluster');
var CronJob = require('cron').CronJob;
var job = new CronJob('*/5 * * * *', function () {
    var json = { "operacion": "verificarVigencia" };
    var promesa = new Promise(function (resolve, reject) {
        pool.query("update funciones set vigente=0 where timediff(time(fecha),curTime())<=\"00:10:00\"", function (error, results) {
            if (error)
                resolve(error);
            resolve("se modifico la vigencia de una funcion");
        });
    });
    promesa.then(function (resultado) {
        console.log(resultado);
    });
    console.log("se ejecuta cada 5 minutos");
});
job.start();
var mysql = require('mysql'); // hacer q lo lea de un archivo https://nodejs.dokry.com/1191/leer-y-escribir-un-archivo-de-texto-en-typescript.html
var pool = mysql.createPool({
    conLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "cine",
    port: 3306
});
var app = express();
var port = 3001;
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.listen(port, function () {
    console.log("App listening at http://localhost:" + port);
});
app.post('/reservar', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var butacasAReservar, promesa;
    return __generator(this, function (_a) {
        butacasAReservar = new Array();
        promesa = new Promise(function (resolve, reject) {
            pool.query("select * from reservas where funcion=" + req.body.id_funcion + " and usuario=" + req.body.user_id, function (error, results) {
                if (error)
                    resolve("Error al buscar las funciones");
                if (results[0] != null) {
                    resolve(1); // si el usuario reservo para esa funcion retorna 1
                }
            });
            pool.query("select * from funciones where id=" + req.body.id_funcion + " and vigente=0", function (error, results) {
                if (error)
                    resolve("Error al buscar las funciones");
                if (results[0] == null) {
                    pool.query("SELECT butacas_disponibles FROM funciones where id=" + req.body.id_funcion, function (err, result, fields) {
                        if (err)
                            resolve(err);
                        var butacasAReservar = req.body.butacas.replace(/'/g, '"');
                        butacasAReservar = JSON.parse(butacasAReservar);
                        var butacasDisponibles = result[0].butacas_disponibles;
                        butacasDisponibles = JSON.parse(butacasDisponibles);
                        butacasDisponibles.forEach(function (element) {
                            butacasDisponibles[butacasDisponibles.indexOf(element)] = element.replace(/'/g, '"');
                        });
                        butacasAReservar.forEach(function (butaca) {
                            if (!butacasDisponibles.includes(butaca)) {
                                resolve("Las butacas no estan disponibles");
                            }
                        });
                        pool.query("insert into reservas values(null, " + req.body.user_id + ", " + req.body.id_funcion + "," + JSON.stringify(req.body.butacas.replace(/'/g, '"')) + ")", function (err, result, fields) {
                            if (err)
                                resolve(err);
                            butacasAReservar.forEach(function (butaca) {
                                if (butacasDisponibles.includes(butaca)) {
                                    butacasDisponibles.splice(butacasDisponibles.indexOf(butaca), 1);
                                }
                            });
                            pool.query("update funciones set butacas_disponibles='" + JSON.stringify(butacasDisponibles) + "' where id=" + req.body.id_funcion, function (err, result, fields) {
                                if (err)
                                    resolve(err);
                                resolve("Reserva realizada correctamente");
                            });
                        });
                    });
                }
            });
        });
        promesa.then(function (resultado) {
            res.json(resultado);
        });
        return [2 /*return*/];
    });
}); });
app.get('/funciones', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var fecha, funciones, fechaLocal, parametro, promesa;
    return __generator(this, function (_a) {
        fecha = new Date();
        funciones = [];
        fechaLocal = fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDay() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
        parametro = { "fecha": fechaLocal, "operacion": "mostrarFunciones" };
        promesa = new Promise(function (resolve, reject) {
            pool.query("select * from funciones where vigente=1 and fecha>\"" + parametro.fecha + "\"", function (error, results) {
                if (error)
                    throw error;
                else {
                    results.forEach(function (element) {
                        funciones.push(element);
                    });
                    resolve(funciones);
                }
            });
        });
        promesa.then(function (resultado) {
            res.json(resultado);
        });
        return [2 /*return*/];
    });
}); });
