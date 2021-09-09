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
var cluster = require('cluster');
var CronJob = require('cron').CronJob;
var job = new CronJob('*/5 * * * *', function () {
    var json = { "operacion": "verificarVigencia" };
    var worker = cluster.fork();
    worker.send(json);
    worker.on('message', function (result) {
        console.log(result);
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
if (cluster.isWorker) {
    process.on("message", function (parametro) {
        pool.getConnection(function (err, con) {
            if (err) {
                console.log(err);
            }
            con.beginTransaction(function (err) {
                if (err)
                    throw err;
                if (parametro.operacion === "reservar") {
                    con.query("select * from funciones where id=" + parametro.id_funcion + " and vigente=0", function (err, result, fields) {
                        if (err) {
                            return con.rollback(function () {
                                throw err;
                            });
                        }
                        if (result[0] == null) {
                            con.query("select * from reservas where funcion=" + parametro.id_funcion + " and usuario=" + parametro.user_id, function (err, result, fields) {
                                if (err) {
                                    return con.rollback(function () {
                                        throw err;
                                    });
                                }
                                if (result[0] == null) {
                                    con.query("SELECT butacas_disponibles FROM funciones where id=" + parametro.id_funcion + " FOR UPDATE", function (err, result, fields) {
                                        if (err) {
                                            return con.rollback(function () {
                                                throw err;
                                            });
                                        }
                                        var butacasAReservar = parametro.butacas;
                                        butacasAReservar = JSON.parse(butacasAReservar);
                                        var butacasDisponibles = result[0].butacas_disponibles;
                                        butacasDisponibles = JSON.parse(butacasDisponibles);
                                        butacasDisponibles.forEach(function (element) {
                                            butacasDisponibles[butacasDisponibles.indexOf(element)] = element.replace(/'/g, '"');
                                        });
                                        butacasAReservar.forEach(function (butaca) {
                                            if (!butacasDisponibles.includes(butaca)) {
                                                return con.rollback(function () {
                                                    con.release();
                                                    process.send("No se puede reservar, las butacas no estan disponibles");
                                                    process.kill(process.pid);
                                                });
                                            }
                                        });
                                        con.query("insert into reservas values(null, " + parametro.user_id + ", " + parametro.id_funcion + "," + JSON.stringify(parametro.butacas) + ")", function (err, result, fields) {
                                            var vigente = 1;
                                            if (err) {
                                                return con.rollback(function () {
                                                    throw err;
                                                });
                                            }
                                            butacasAReservar.forEach(function (butaca) {
                                                if (butacasDisponibles.includes(butaca)) {
                                                    butacasDisponibles.splice(butacasDisponibles.indexOf(butaca), 1);
                                                }
                                            });
                                            if (butacasDisponibles.length == 0) { //si reservo las ultimas butacas cambia la vigencia a 0
                                                vigente = 0;
                                            }
                                            con.query("update funciones set butacas_disponibles='" + JSON.stringify(butacasDisponibles) + "', vigente=" + vigente + " where id=" + parametro.id_funcion, function (err, result, fields) {
                                                if (err) {
                                                    return con.rollback(function () {
                                                        throw err;
                                                    });
                                                }
                                                con.commit(function (err) {
                                                    if (err) {
                                                        return con.rollback(function () {
                                                            throw err;
                                                        });
                                                    }
                                                    con.release();
                                                    console.log("Proceso " + process.pid);
                                                    process.send("Reserva realizada correctamente");
                                                    process.kill(process.pid);
                                                });
                                            });
                                        });
                                    });
                                }
                                else {
                                    con.release();
                                    process.send("No se puede reservar, el usuario ya reservo para esa funcion");
                                    process.kill(process.pid);
                                }
                            });
                        }
                        else {
                            con.release();
                            process.send("No se puede reservar, la funcion no esta vigente");
                            process.kill(process.pid);
                        }
                    });
                }
                else if (parametro.operacion === "mostrarFunciones") {
                    var funciones_1 = [];
                    con.query("select * from funciones where vigente=1", function (error, results) {
                        if (error)
                            throw error;
                        else {
                            results.forEach(function (element) {
                                funciones_1.push(element);
                            });
                            process.send(funciones_1);
                        }
                        con.release();
                        console.log("Proceso " + process.pid);
                        process.kill(process.pid);
                    });
                }
                else if (parametro.operacion === "cancelarReserva") {
                    var butacasDisponibles_1;
                    var butacasReservadas_1;
                    var idFuncion_1;
                    con.query("SELECT * from funciones join reservas on funciones.id=reservas.funcion where timediff(time(fecha),curTime())>\"01:00:00\" and reservas.id='" + parametro.idReserva + "' and usuario='" + parametro.idUsuario + "'", function (error, results) {
                        if (error)
                            throw error;
                        if (results.length == 0) {
                            process.send("Error al cancelar la reserva, falta menos de una hora o no es el usuario correcto");
                        }
                        else {
                            butacasDisponibles_1 = results[0].butacas_disponibles;
                            butacasReservadas_1 = results[0].butacas_reservadas;
                            idFuncion_1 = results[0].funcion;
                            con.query("delete from reservas where id ='" + parametro.idReserva + "'", function (error, results) {
                                if (error)
                                    throw error;
                                if (error)
                                    process.send("Error al cancelar la reserva");
                                butacasReservadas_1 = JSON.parse(butacasReservadas_1);
                                butacasDisponibles_1 = JSON.parse(butacasDisponibles_1);
                                butacasReservadas_1.forEach(function (element) {
                                    butacasDisponibles_1.push(element);
                                });
                                butacasDisponibles_1.forEach(function (element) {
                                    butacasDisponibles_1[butacasDisponibles_1.indexOf(element)] = element.replace(/'/g, '"');
                                });
                                con.query("update funciones set butacas_disponibles='" + JSON.stringify(butacasDisponibles_1) + "', vigente=1 where id='" + idFuncion_1 + "'", function (err, result, fields) {
                                    if (err) {
                                        return con.rollback(function () {
                                            throw err;
                                        });
                                    }
                                    con.commit(function (err) {
                                        if (err) {
                                            return con.rollback(function () {
                                                throw err;
                                            });
                                        }
                                        con.release();
                                        console.log("Proceso " + process.pid);
                                        process.send("Reserva cancelada correctamente");
                                        process.kill(process.pid);
                                    });
                                });
                            });
                        }
                    });
                }
                else if (parametro.operacion === "verificarVigencia") {
                    con.query("update funciones set vigente=0 where timediff(time(fecha),curTime())<=\"00:10:00\"", function (error, results) {
                        if (error)
                            throw error;
                        con.commit(function (err) {
                            if (err) {
                                return con.rollback(function () {
                                    throw err;
                                });
                            }
                            con.release();
                            console.log("Proceso " + process.pid);
                            process.send("se modifico la vigencia de una funcion");
                            process.kill(process.pid);
                        });
                    });
                }
            });
        });
    });
}
else {
    var app = express();
    var port_1 = 3000;
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
        next();
    });
    app.use(bp.json());
    app.use(bp.urlencoded({ extended: true }));
    app.listen(port_1, function () {
        console.log("App listening at http://localhost:" + port_1);
    });
    app.post('/reservar', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var butacasAReservar, worker;
        return __generator(this, function (_a) {
            console.log("entre");
            console.log(req.body);
            butacasAReservar = req.body.butacas.replace(/'/g, '"');
            req.body.butacas = butacasAReservar;
            butacasAReservar = JSON.parse(butacasAReservar); //lo pasamos a json para ver si son mas de 6, pero lo mandamos con otro formato
            if (butacasAReservar.length <= 6) {
                worker = cluster.fork();
                req.body.operacion = "reservar";
                worker.send(req.body);
                worker.on("message", function (result) {
                    res.status(200).send(result);
                });
            }
            else {
                res.send("No puede reservar mas de 6 butacas");
            }
            return [2 /*return*/];
        });
    }); });
    app.get('/funciones', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var parametro, worker;
        return __generator(this, function (_a) {
            parametro = { "operacion": "mostrarFunciones" };
            worker = cluster.fork();
            worker.send(parametro);
            worker.on('message', function (result) {
                res.status(200).json(result);
            });
            return [2 /*return*/];
        });
    }); });
    app.get('/butacas/:idSala', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var butacas, promesa;
        return __generator(this, function (_a) {
            butacas = [];
            promesa = new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        pool.query("SELECT butacas from salas where id=" + req.params.idSala, function (error, results) {
                            if (error)
                                resolve(error);
                            butacas = results[0];
                            resolve(butacas);
                        });
                        return [2 /*return*/];
                    });
                });
            });
            promesa.then(function (resultado) {
                res.json(resultado);
            });
            return [2 /*return*/];
        });
    }); });
    app.post('/cancelar_reserva', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var usuario, reserva, parametro, worker;
        return __generator(this, function (_a) {
            usuario = req.body.user_id;
            reserva = req.body.reserva_id;
            parametro = { "idUsuario": usuario, "idReserva": reserva, "operacion": "cancelarReserva" };
            worker = cluster.fork();
            worker.send(parametro);
            worker.on('message', function (result) {
                res.status(200).send(result);
            });
            return [2 /*return*/];
        });
    }); });
}
