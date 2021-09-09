import express, { json } from 'express';
import * as http from 'http';

const express = require('express');
const bp = require('body-parser');
// const cluster = require('cluster');

let CronJob = require('cron').CronJob;
let job = new CronJob('*/5 * * * *', function() {
    let json={"operacion":"verificarVigencia"};
    let promesa=new Promise(function (resolve, reject){
        pool.query(`update funciones set vigente=0 where timediff(time(fecha),curTime())<="00:10:00"`, function (error, results) {
            if (error) resolve(error); 
                resolve("se modifico la vigencia de una funcion");
        });
    });
    promesa.then(resultado => {
        console.log(resultado);
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

const app = express();
const port = 3001;


app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});

app.post('/reservar', async (req: express.Request, res: express.Response) => {
    let butacasAReservar=new Array<String>();
    let promesa=new Promise(function (resolve, reject){
        pool.query(`select * from reservas where funcion=${req.body.id_funcion} and usuario=${req.body.user_id}`, function (error, results) {
            if (error) resolve("Error al buscar las funciones"); 
            if(results[0]!=null){
                resolve(1);// si el usuario reservo para esa funcion retorna 1
            }
        });
        pool.query(`select * from funciones where id=${req.body.id_funcion} and vigente=0`, function (error, results) {
            if (error) resolve("Error al buscar las funciones"); 
            if(results[0]==null){
                pool.query(`SELECT butacas_disponibles FROM funciones where id=${req.body.id_funcion}`, function (err, result, fields) {
                    if (err) resolve(err);
                    let butacasAReservar= req.body.butacas.replace(/'/g, '"');
                    butacasAReservar = JSON.parse(butacasAReservar);
                    let butacasDisponibles = result[0].butacas_disponibles;
                    butacasDisponibles = JSON.parse(butacasDisponibles);
                    butacasDisponibles.forEach(element => {
                        butacasDisponibles[butacasDisponibles.indexOf(element)]=element.replace(/'/g, '"');
                    });
                    butacasAReservar.forEach(butaca=>{
                        if(!butacasDisponibles.includes(butaca)){
                            resolve("Las butacas no estan disponibles");
                        }
                    });
                    pool.query(`insert into reservas values(null, ${req.body.user_id}, ${req.body.id_funcion},${JSON.stringify(req.body.butacas.replace(/'/g, '"'))})`, function (err, result, fields) {
                        if (err) resolve(err);
                        let vigente=1;
                        butacasAReservar.forEach(butaca=>{
                            if(butacasDisponibles.includes(butaca)){
                                butacasDisponibles.splice(butacasDisponibles.indexOf(butaca),1);
                            }
                        });
                        if(butacasDisponibles.length==0){ //si reservo las ultimas butacas cambia la vigencia a 0
                            vigente=0;
                        }
                        pool.query(`update funciones set butacas_disponibles='${JSON.stringify(butacasDisponibles)}', vigente=${vigente} where id=${req.body.id_funcion}`, function (err, result, fields) {
                            if (err) resolve(err);
                            resolve("Reserva realizada correctamente");
                        });
                    });
                });
            }
        });
    });
    promesa.then(resultado => {
        res.json(resultado);
    });
});

app.get('/funciones', async(req, res) => {
    let funciones=[];
    let promesa=new Promise(function (resolve, reject){
        pool.query(`select * from funciones where vigente=1`, function (error, results) {
            if (error) throw error; 
            else{ 
                results.forEach(element => {
                    funciones.push(element);
                });
                resolve(funciones);
            }
        });
    });
    promesa.then(resultado => {
        res.json(resultado);
    });
});
