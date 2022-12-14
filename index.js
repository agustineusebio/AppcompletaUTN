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
    res.render('index', {
    titulo: 'Home'
    })
})

app.get('/formulario', (req, res) => {
    res.render('formulario')
    titulo: 'Formulario'
})

app.get('/productos', (req, res) => {
    let sql = "SELECT * FROM productos"; 
        conexion.query(sql, function(err, result){
        if (err) throw err;
        //console.log(result);
        res.render('productos', {
        titulo: 'Productos',
        datos: result 
        })
    })
})




app.get('/contacto', (req, res) => {
    let sql = "SELECT * FROM contactos"; 
        conexion.query(sql, function(err, result){
        if (err) throw err;
        res.render('contacto', {
        titulo: 'Contacto',
        datos: result
        })
    })
})

app.post('/formulario', (req, res)  => {
    const nombre = req.body.nombre;
    const precio = req.body.precio;
    const descripcion = req.body.descripcion;
    /*console.log(nombre)
    console.log(precio);
    console.log(descripcion);*/

    let datos = {
        nombre: nombre,
        precio: precio,
        descripcion: descripcion
        /*la primera es el atributo de mi tabla y lo que viene de la variable que recibo del front que se llama asi*/
    }   
    
    let sql = "INSERT INTO productos set ?";

        conexion.query(sql, datos, function(err){
            if (err) throw err;
                console.log(`1 Registro insertado`);
                res.render('enviado')
        })

    /*res.send(`Sus datos han sido recibidos: ${nombre} - ${precio} - ${descripcion}`);*/
    
})

    app.post('/contacto', (req, res) =>{
        const nombre = req.body.nombre;
        const email = req.body.email;

    //Creamos una funcion para enviar email al cliente

      // 1 Configuramos la cuenta del envio
    async function envioMail(){
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAILPASSWORD
        }   
     });

       // 2 Envio del mail
  let info = await transporter.sendMail({
    from: process.env.EMAIL, // sender address
    to: `${email}`, // list of receivers
    subject: "Gracias por suscribirse a nuestra App", // Subject line
    html: `Muchas gracias por visitar nuestra pagina <br>
    Recibiras nuestras promociones a esta direccion de correo, <br>
    Buen fin de semana!!` // plain text body
  });


    }

        let datos = {
            nombre: nombre,
            email: email,
        }

    let sql = "INSERT INTO contactos set ?";

    conexion.query(sql, datos, function(err){
        if (err) throw err;
            console.log(`1 Registro insertado`);

            //Email
            envioMail().catch(console.error);
            res.render('enviado')
        })


    })

    //Servidor a la escucha de peticionesl
    app.listen(PORT, () => {
        console.log(`Servidor trabajando en el Puerto ${PORT}`);
    })
