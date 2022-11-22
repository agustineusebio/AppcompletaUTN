//Llamamos rodas las Librerias instaladas
const express = require('express');
const app = express();
const mysql = require('mysql2');
// Motor de plantilla
const hbs = require('hbs');
// Es para encontrar los archivos dentro de VSC
const path = require('path');
//Para enviar mails
const nodemailer = require('nodemailer');
//Variables de entorno(info que no quiero que sea visible)
require('dotenv').config();

//Configuramos el puerto
const PORT = process.env.PORT || 9000;

//MiddelWare es para que nuestra app pueda leer algunos datos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//Configuramos el motor de plantillas de HBS(handlebars)
app.set('view engine', 'hbs');
//Configuramos la ubicacion de las plantillas
app.set('views', path.join(__dirname, 'views'));
//Configuramos los parciales de los motores de plantillas
hbs.registerPartials(path.join(__dirname, 'views/partials'));

//Conectamos a la Base de Datos
const conexion = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.DBPORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    
})

conexion.connect((err)=>{
    if(err) throw err;
        console.log(`Conectado a la Database ${process.env.DATABASE}`);   //Base de datos creada en Workbench
        })

//Rutas de la aplicacion
app.get('/', (req, res) => {
    res.send(`<h1>Bienvenidos a la App Completa</h1>`)
})

//Servidor a la escucha de peticionesl
app.listen(PORT, () => {
    console.log(`Servidor trabajando en el Puerto ${PORT}`);
})

//Cógigo para crear una tabla (ojo: una sola vez) despues siempre tira error porque ya existe
conexion.connect(function(err){
    if (err){
        console.log(`El error es: ${err}`)
    }else{
        let sql = "create table clientes(nombre VARCHAR(100), direccion VARCHAR(100))"; //se puede hacer asi o con con.query
        conexion.query(sql, function(err){ //le tengo que agregar sql al principio que es la tabla creada con let
            if (err) throw err;
                console.log(`Tabla Clientes Creada`);
        })
    }
});
