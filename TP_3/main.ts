import express, { json } from 'express';
import * as http from 'http';

const express = require('express');
const bp = require('body-parser');
const cluster = require('cluster');

let CronJob = require('cron').CronJob;
let job = new CronJob('*/5 * * * *', function() {
    let json={"operacion":"verificarVigencia"};
    const worker = cluster.fork();
    worker.send(json);
    worker.on('message', (result) => {
        console.log(result);
    });
    console.log("se ejecuta cada 5 minutos");
});
job.start();

let mysql = require('mysql'); // hacer q lo lea de un archivo https://nodejs.dokry.com/1191/leer-y-escribir-un-archivo-de-texto-en-typescript.html

const pool = mysql.createPool({
    conLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "cine",
    port: 3306
});

if(cluster.isWorker){
    process.on("message", (parametro) => {
        pool.getConnection(function(err, con){
            if (err) {
                console.log(err);
            }
            con.beginTransaction(function(err){
                if (err) throw err;
                if(parametro.operacion==="reservar"){ 
                    con.query(`select * from funciones where id=${parametro.id_funcion} and vigente=0`, function (err, result, fields) {// si la funcion esta vigente
                        if (err) {
                            return con.rollback(function() {
                                throw err;
                            });
                        }
                        if(result[0]==null){
                            con.query(`select * from reservas where funcion=${parametro.id_funcion} and usuario=${parametro.user_id}`, function (err, result, fields) { //si reservo para esa funcion
                                if (err) {
                                    return con.rollback(function() {
                                        throw err;
                                    });
                                }
                                if(result[0]==null){
                                    con.query(`SELECT butacas_disponibles FROM funciones where id=${parametro.id_funcion} FOR UPDATE`, function (err, result, fields) {
                                        if (err) {
                                            return con.rollback(function() {
                                                throw err;
                                            });
                                        }
                                        let butacasAReservar= parametro.butacas;
                                        butacasAReservar = JSON.parse(butacasAReservar);
                                        let butacasDisponibles = result[0].butacas_disponibles;
                                        butacasDisponibles = JSON.parse(butacasDisponibles);
                                        butacasDisponibles.forEach(element => {
                                            butacasDisponibles[butacasDisponibles.indexOf(element)]=element.replace(/'/g, '"');
                                        });
                                        butacasAReservar.forEach(butaca=>{ //nos fijamos que las butacas esten disponibles
                                            if(!butacasDisponibles.includes(butaca)){
                                                return con.rollback(function() {
                                                    con.release();
                                                    process.send("No se puede reservar, las butacas no están disponibles");
                                                    process.kill(process.pid);
                                                });
                                            }
                                        });
                                        con.query(`insert into reservas values(null, ${parametro.user_id}, ${parametro.id_funcion},${JSON.stringify(parametro.butacas)})`, function (err, result, fields) {
                                            let vigente=1;
                                            if (err) {
                                                return con.rollback(function() {
                                                    throw err;
                                                });
                                            }
                                            butacasAReservar.forEach(butaca=>{
                                                if(butacasDisponibles.includes(butaca)){
                                                    butacasDisponibles.splice(butacasDisponibles.indexOf(butaca),1);
                                                }
                                            });
                                            if(butacasDisponibles.length==0){ //si reservo las ultimas butacas cambia la vigencia a 0
                                                vigente=0;
                                            }
                                            con.query(`update funciones set butacas_disponibles='${JSON.stringify(butacasDisponibles)}', vigente=${vigente} where id=${parametro.id_funcion}`, function (err, result, fields) {
                                                if (err) {
                                                    return con.rollback(function() {
                                                        throw err;
                                                    });
                                                }
                                                con.commit(function(err){
                                                    if (err) {
                                                        return con.rollback(function() {
                                                            throw err;
                                                        });
                                                    }
                                                    con.release();
                                                    console.log(`Proceso ${process.pid}`);
                                                    process.send("Reserva realizada correctamente");
                                                    process.kill(process.pid);
                                                });
                                            });
                                        });
                                    }); 
                                }
                                else{
                                    con.release();
                                    process.send("No se puede reservar, el usuario ya reservó para esa funcion");
                                    process.kill(process.pid);
                                }
                                    
                            });
                        }
                        else{
                            con.release();
                            process.send("No se puede reservar, la función no está vigente");
                            process.kill(process.pid);
                        }
                    });
                    
                }
                else if(parametro.operacion==="mostrarFunciones"){
                    let funciones=[];
                    con.query(`select * from funciones where vigente=1`, function (error, results) {
                        if (error) throw error; 
                        else{ 
                            results.forEach(element => {
                                funciones.push(element);
                            });
                            process.send(funciones);
                        }
                        con.release();
                        console.log(`Proceso ${process.pid}`);
                        process.kill(process.pid); 
                    });
                }

                else if(parametro.operacion==="cancelarReserva"){ 
                    let butacasDisponibles;
                    let butacasReservadas;
                    let idFuncion;
                    con.query(`SELECT * from funciones join reservas on funciones.id=reservas.funcion where timediff(time(fecha),curTime())>"01:00:00" and reservas.id='${parametro.idReserva}' and usuario='${parametro.idUsuario}'`, function (error, results) {
                        if (error) throw error; 
                        if(results.length==0){
                            process.send("Error al cancelar la reserva, falta menos de una hora o no es el usuario correcto");
                        } 
                        else{
                            butacasDisponibles=results[0].butacas_disponibles;
                            butacasReservadas=results[0].butacas_reservadas;
                            idFuncion=results[0].funcion;
                            con.query(`delete from reservas where id ='${parametro.idReserva}'`, function (error, results) {
                                if (error) throw error; 
                                if(error) process.send("Error al cancelar la reserva");
                                butacasReservadas = JSON.parse(butacasReservadas);
                                butacasDisponibles = JSON.parse(butacasDisponibles);
                                butacasReservadas.forEach(element => {
                                    butacasDisponibles.push(element);
                                });
                                butacasDisponibles.forEach(element => {
                                    butacasDisponibles[butacasDisponibles.indexOf(element)]=element.replace(/'/g, '"');
                                });
                                con.query(`update funciones set butacas_disponibles='${JSON.stringify(butacasDisponibles)}', vigente=1 where id='${idFuncion}'`, function (err, result, fields) {
                                    if (err) {
                                        return con.rollback(function() {
                                            throw err;
                                        });
                                    }
                                    con.commit(function(err){
                                        if (err) {
                                            return con.rollback(function() {
                                                throw err;
                                            });
                                        }
                                        con.release();
                                        console.log(`Proceso ${process.pid}`);
                                        process.send("Reserva cancelada correctamente");
                                        process.kill(process.pid);
                                    });
                                });
                            });
                        }
                    });
                }
                else if(parametro.operacion==="verificarVigencia"){
                    con.query(`update funciones set vigente=0 where timediff(time(fecha),curTime())<="00:10:00"`, function (error, results) {//pone la funcion como no vigente si faltan menos de 10 minutos
                        if (error) throw error; 
                        con.commit(function(err){
                            if (err) {
                                return con.rollback(function() {
                                    throw err;
                                });
                            }
                            con.release();
                            console.log(`Proceso ${process.pid}`);
                            process.send("se modifico la vigencia de una funcion");
                            process.kill(process.pid);
                        });
                    });
                }
            });
        });
    });
}
else{
    const app = express();
    const port = 3000;

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
        next();
    });

    app.use(bp.json())
    app.use(bp.urlencoded({ extended: true }))

    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`)
    });

    app.post('/reservar', async (req: express.Request, res: express.Response) => {
        console.log("entre");
        console.log(req.body);
        let butacasAReservar;
        butacasAReservar= req.body.butacas.replace(/'/g, '"');
        req.body.butacas=butacasAReservar;
        butacasAReservar=JSON.parse(butacasAReservar); //lo pasamos a json para ver si son mas de 6, pero lo mandamos con otro formato
        if(butacasAReservar.length<=6){
            const worker = cluster.fork();
            req.body.operacion="reservar";
            worker.send(req.body);
            worker.on("message", (result) => {
                res.status(200).send(result);
            });
        }
        else{
            res.send("No puede reservar más de 6 butacas");
        }
    });

    app.get('/funciones', async(req, res) => {
        let parametro={"operacion":"mostrarFunciones"};
        const worker = cluster.fork();
        worker.send(parametro);
        worker.on('message', (result) => {
            res.status(200).json(result);
        });
    });

    app.get('/butacas/:idSala', async(req, res) => {
        let butacas=[];
        const promesa= new Promise(async function (resolve, reject) {
            pool.query(`SELECT butacas from salas where id=${req.params.idSala}`, function (error, results) {
                if(error) resolve(error);
                butacas=results[0];
                resolve(butacas);
                
            });
        });
        promesa.then(resultado => {
            res.json(resultado);
        });
    });

    app.post('/cancelar_reserva', async (req, res) => {
        let usuario = req.body.user_id;
        let reserva = req.body.reserva_id;
        let parametro={"idUsuario":usuario,"idReserva":reserva,"operacion":"cancelarReserva"};
        const worker = cluster.fork();
        worker.send(parametro);
        worker.on('message', (result) => {
            res.status(200).send(result);
        });
    });
}