//Modulos requeridos.
const http= require('http');
const fs=require('fs');
var express=require('express');
var bodyParser= require('body-parser');
var path= require('path');
var expressValidator=require('express-validator');//Valida las entradas de los formularios.
//var Sequelize = require('sequelize');Ayuda a la interacción entre la bd y el servidor.
var mysql= require('mysql');
const port=8080;//Puerto por el que se conecta el servidor.
//Estableciendo la conexión con MySql
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
	port: 8889,//Puerto del servidor de PHP my admin.
  database: 'proyectowebg'
});
//Checando la conexión a la base de datos.
connection.connect(function(err) {
  if (err) {
    console.log('ocurrio un error');
    console.error('error connecting: ' + err.stack);
    return;
  }
  else{
    console.log('Conectado a la base de datos');
    console.log('connected as id ' + connection.threadId);
  }
});
//Objeto tipo express.
var app=express();
//View engine.
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Valores estáticos: CSS, Imágenes, JS.
app.use(express.static(path.join(__dirname,'public')));

//Variables gloales.
app.use(function(req,res,next){
	res.locals.errors=null;
	next();
});
//Validador de los formularios en HTML.
app.use(expressValidator({
	errorFormater: function(param,msg,value){
		var namespace= param.split('.'),
		root= namespace.shift(),
		formParam=root;

		while(namespace.length){
			formParam+='['+namespace.shift()+']';
		}
		return {
			param :formParam,
			msg : msg,
			value : value
		};
	}
}));

//Crea la página principal.
app.get('/',function(req,res){
      res.render('Pantalla_1');
});

//Render de la pantalla 2
app.get('/views/Pantalla_2',function(req,res){
  connection.query('select nombre, tipo, ponderacion from extra_criterio',function(err,result){
      if(err){
        console.error(err);
        res.status(400).send('Error con la base de datos');
        return;
      }
      else{
        console.error(result);
        var criterios=result;//Guardando el resultado del query en la variable.
        res.render('Pantalla_2',{
           criterios:criterios//Arreglo queu fue el resultado de la consulta.
        });
      }
});
});
//Render de la pantalla 3
app.get('/views/Pantalla_3',function(req,res){
  res.render('Pantalla_3');
});
//Formulario del nuevo criterio.
app.post('/views/Pantalla_3', function(req,res){
  req.checkBody('nombre','El nombre del criterio es requerido').notEmpty();
  req.checkBody('tipo','Se requiere seleccionar el tipo del criterio').notEmpty();
  var errors=req.validationErrors();
	if(errors){
		res.render('Pantalla_3',{
			errors: errors
		});
      console.log(errors);
	}
	else{
    var criterio={
      nombre: req.body.nombre,
      ponderacion: req.body.ponderacion,
      tipo: req.body.tipo,
      calificacion: req.body.calificacion
    };
      var query= connection.query('insert into extra_criterio set ?',criterio,function(err,result){
            if(err){
              console.error(err);
              return;
            }
            else{
              console.error(result);
              console.log(query);
            }
          });
          query= connection.query('select nombre, tipo, ponderacion from extra_criterio',function(err,result){
              if(err){
                console.error(err);
                res.status(400).send('Error con la base de datos');
                return;
              }
              else{
                console.error(result);
                var criterios=result;//Guardando el resultado del query en la variable.
                res.render('Pantalla_2',{
                   criterios:criterios//Arreglo queu fue el resultado de la consulta.
                });
              }
        });
      }
});

//Render de la pantalla 4
app.get('/views/Pantalla_4',function(req,res){
  res.render('Pantalla_4');
});
//Render de la página 5
app.get('/views/Pantalla_5',function(req,res){
  res.render('Pantalla_5');
});
//Render de la página 6
app.get('/views/Pantalla_6',function(req,res){
  res.render('Pantalla_6');
});
//Render de la página 7
app.get('/views/Pantalla_7',function(req,res){
  res.render('Pantalla_7');
});
//Funcion que despliega la tabla de los clientes.
app.get('/views/tabla',function(req,res){
    connection.query('select nombre, telefono from clientes',function(err,result){
        if(err){
          console.error(err);
          return;
        }
        else{
          console.error(result);
          var clientes=result;
          console.log(clientes);
          res.render('tabla',{
            clientes:clientes//Arreglo queu fue el resultado de la consulta.
          });
        }
  });
});

//Función que recibe el formulario del HTML
app.post('/users/add',function(req,res){
	req.checkBody('nombre','El nombre es requerido').notEmpty();
	req.checkBody('fechaInicio','Se requiere una fecha de inicio').notEmpty();
	var errors=req.validationErrors();
	if(errors){
		res.render('index',{
			title:'Inicio',
			saludo:'Hola Arturo',
			errors: errors
		});
	}
	else{
    var cliente={
      nombre: req.body.nombre,
      telefono: req.body.telefono
    };
    var query= connection.query('insert into clientes set ?',cliente,function(err,result){
        if(err){
          console.error(err);
          return;
        }
        else{
          console.error(result);
          console.log(query);
        }
    });
		res.send("Todo bien");
	}
});

//Puerto por el cual el servidor está corriendo.
app.listen(port,function(){
	console.log("El servidor esta corriendo");
});

/*echo "# ProyectoAyEP" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/R2rog/ProyectoAyEP.git
git push -u origin master*/
