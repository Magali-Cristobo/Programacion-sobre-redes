import { Compra } from "./Compra";
import { Producto } from "./Producto";
import { Usuario} from "./Usuario";
import { CalificacionVendedor} from "./CalificacionVendedor";
import { CalificacionComprador} from "./CalificacionComprador";
import { Favorito } from "./Favorito";

const express = require('express');
const bp = require('body-parser');

const app = express();
const port = 3000;

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});

function fechaActual():Date{ // devuelve la fecha actual (utc) en un formato de yyyy-mm-dd hh:mm:ss.ms
    let date;
    date = new Date();
    date = date.getUTCFullYear() + '-' +('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' + 
        ('00' + date.getUTCHours()).slice(-2) + ':' + 
        ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
        ('00' + date.getUTCSeconds()).slice(-2);
    return date; 
}

app.get('/productos', async (req, res) => {
    let jsonObject = req.query ;
    let map = new Map<string, string>();
    let productos;
    for (var value in jsonObject) {
        if(value!="orden"){
            map.set(value,jsonObject[value]);
        }
    }
    if(jsonObject["orden"]!=null){//hacemos esto porque orden tiene que estar al final de la query
        map.set("orden",jsonObject["orden"]);
    }
    map.forEach((value: string, key:string) => { //recorremos el map y vamos concatenando los filtros
        switch(key){
            case "busqueda":
                productos = Producto.where("nombre ","like ","'"+"%"+(req.query.busqueda)+"%"+"'");
            break;
            case "usado":
                productos = Producto.where("usado","=",req.query.usado);
            break;
            case "orden":
                if(value=="precio"){
                    productos = Producto.orderBy("precio"," ASC");    
                }
                else{
                    productos = Producto.orderBy("calificacion_vendedor"," DESC");
                }
            break;
        }
    });
    productos= await Producto.get();
    res.json(productos);
});

app.get('/usuarios/:id/fav', async (req, res) => {
    let usuarioEncontrado:Usuario= await Usuario.find(req.params.id);
    let productos=[];
    let favoritos=[];
    if(usuarioEncontrado!=null){ 
        favoritos=usuarioEncontrado.getFavoritos();
        const promesa= new Promise(async function (resolve, reject) {
            for(let i=0;i<favoritos.length;i++){
                productos.push( await Producto.find(favoritos[i].producto));                
            }
            resolve(productos);   
        });
        
        promesa.then(resultado => {
            res.json(resultado);
        }); 
    }  
    else{
        res.json("No existe el usuario");
    }     
    
});

app.post('/usuarios/:id/fav', async (req, res) => {
    let usuario:Usuario=await Usuario.find(req.params.id);
    let producto= await Producto.find(req.body.id_producto);
    let favorito = new Favorito(0, usuario,producto);
    if(usuario!=null){
        await favorito.save();
        res.send("Favorito agregado correctamente");
    }
    else{
        res.send("El usuario no existe");
    }
   
});

app.delete('/usuarios/:id/fav', async (req, res) => {
    await Usuario.crearConexion().query(`Delete from favoritos where id_usuario=${req.params.id} and id_producto=${req.body.id_producto}`, function (error, results) {
        if (error) res.send("No se ha podido eliminar el producto de favoritos"); 
        else  res.send('Eliminado de favoritos correctamente');
    });
    
});

app.get('/usuarios/:id/compras', async(req, res) => {
    let compras=[];
    const promesa= new Promise(async function (resolve, reject) {
        compras= await Compra.where("id_usuario","=",req.params.id).get();
        resolve(compras);   
    });
    promesa.then(compras => {
        res.json(compras);
    });  
    
});

app.post('/usuarios/:id/compras', async(req, res) => {
    let producto:Producto=await Producto.find(req.body.id_producto);
    let comprador:Usuario=await Usuario.find(req.params.id);
    if(producto != null && comprador != null && req.body.cantidad<= producto.getStock() && comprador.getSaldo() >= (producto.getPrecio() * req.body.cantidad) ){ // nos fijamos que existan el producto y el comprador, que haya stock suficiente y que le alcance la plata
        let compra=new Compra(0,producto,req.body.cantidad,comprador,fechaActual());
        let vendedor:Usuario = await Usuario.find(producto.getVendedor());
        //disminuimos el stock, el saldo del vendedor y le sumamos saldo al vendedor
        producto.setStock(producto.getStock() - req.body.cantidad);
        comprador.setSaldo(comprador.getSaldo() - producto.getPrecio());
        vendedor.setSaldo(vendedor.getSaldo() + producto.getPrecio());
        await producto.save();
        await comprador.save();
        await vendedor.save();
        res.send(await compra.save());
    }
    else{
        res.send("No se pudo realizar la compra");
    }
});

app.get('/usuarios/:id/calificaciones',  async (req, res) => { 
    let calificaciones=[]; 
    let calificacionesVendedor=await CalificacionVendedor.where("id_vendedor","=",req.params.id).get();
    let calificacionesComprador=await CalificacionComprador.where("id_comprador", "=", req.params.id).get();
    calificacionesVendedor.forEach(element => {// agregamos el contenido de los dos arrays en uno solo
        calificaciones.push(element);
    });
    calificacionesComprador.forEach(element => {
        calificaciones.push(element);
    });
    res.json(calificaciones);
});
    
app.post('/usuarios/:id/calificaciones', async(req, res) => {
    let compra:Compra = await Compra.find(req.body.id_operacion);
    let producto:Producto= compra.getProducto();
    let vendedor = await Usuario.find(producto.getVendedor());
    let comprador= compra.getComprador();
    if(producto != null && vendedor != null && comprador != null ){
        if(req.body.id_calificante == comprador.getId() && !compra.getVendedorCalificado()){// si es el comprador y si no esta calificado el vendedor
            compra.setVendedorCalificado(true);
            let calificacion= new CalificacionComprador(fechaActual(), 0,req.body.calificacion,vendedor,comprador);
            await calificacion.save();
            let promedio = await vendedor.obtenerPromedioVendedor();
            vendedor.setCalificacionVendedor(promedio);
            await vendedor.save();
            res.json("Comprador califico a vendedor exitosamente");
        }
        else if(!compra.getCompradorCalificado()){// si es el vendedor y no esta calificado el comprador 
            compra.setCompradorCalificado(true);
            let calificacion =  new CalificacionVendedor(fechaActual(), 0, req.body.calificacion,vendedor,comprador);
            await calificacion.save();
            let promedio = await comprador.obtenerPromedioComprador();            
            comprador.setCalificacionComprador(promedio);
            await comprador.save();
            res.json("Vendedor califico a comprador exitosamente");
        }
        else{
           res.json("ya esta calificado"); 
        } 
        await compra.save();
    }
    else{
        res.send("Error Los datos no coinciden con nuestra base");
    }
});