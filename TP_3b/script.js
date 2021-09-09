const axios = require('axios').default;
let promesas = [];
let butacas= ["a1","b1","c1","d1","e1","f1","g1","h1","i1","j1","k1","l1","m1","n1","o1"];
let segundosInicio;
for(let i = 1; i <= 15; i++){
    segundosInicio=new Date();
    promesas.push(axios.get('http://localhost:3001/funciones').then(res => {console.log("sin cluster",i,new Date()-segundosInicio)}));
    segundosInicio=new Date();
    promesas.push(axios.get('http://localhost:3000/funciones').then(res => {console.log("con cluster",i,new Date()-segundosInicio)}));
    
}

for(let i = 1; i <= 15; i++){
    segundosInicio=new Date();
    promesas.push(axios.post('http://localhost:3000/reservar',{user_id:i, id_funcion:4,butacas:`["${butacas[i-1]}"]`}).then(res => {console.log("con cluster reserva",i,new Date()-segundosInicio)}));
    segundosInicio=new Date();
    promesas.push(axios.post('http://localhost:3001/reservar',{user_id:i, id_funcion:3,butacas:`["${butacas[i-1]}"]`}).then(res => {console.log("sin cluster reserva",i,new Date()-segundosInicio)}));
}
Promise.all(promesas).then(res => {console.log("termine")});