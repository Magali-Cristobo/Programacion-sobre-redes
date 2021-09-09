var express = require('express');
var app = express();
var port = 3000;
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.listen(port, function () {
    console.log("Example app listening at http://localhost:" + port);
});
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecommerce'
});
connection.connect();
connection.query('SELECT id AS solution from compras where cantidad=1', function (error, results, fields) {
    if (error)
        throw error;
    console.log('The solution is: ', results[0].solution);
});
connection.end();
