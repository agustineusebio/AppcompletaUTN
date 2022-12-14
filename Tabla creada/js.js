
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
