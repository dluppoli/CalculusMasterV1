import { eratostene } from './controllers/eratostene.js';
import { pigreco } from './controllers/pigreco.js';
import express  from 'express';
import mustacheExpress from 'mustache-express';

import dotenv from 'dotenv';
dotenv.config();

/*Express Config*/
var app = express();
app.set('views','./views');
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());
app.use(express.static('assets'));
app.use(express.urlencoded({ extended: false }));

/*Home Page*/
app.get('/', function (req, res) {
   res.render('index',{ 
        pageTitle: 'Laboratorio di piattaforme e metodologie cloud - AA 2023-24', is_home: true
    });
})

/*Numeri Primi*/
app.get('/numeriprimi', function (req, res) {
   res.render('index',{
      pageTitle: 'Calcolo numeri primi', is_numeriprimi: true
   })
})

app.post('/numeriprimi', function (req, res) {
   let numero = parseInt(req.body.numero);
   if( isNaN(numero)) 
      res.render('index',{ 
         pageTitle: 'Calcolo numeri primi', is_numeriprimi: true, soloPrimi:req.body.soloPrimi,
         error:'Inserire un numero valido'
      });
   else
      res.render('index',{ 
         pageTitle: 'Calcolo numeri primi', is_numeriprimi: true, numero:numero, soloPrimi:req.body.soloPrimi,
         result:eratostene(numero,req.body.soloPrimi ? true : false)
      });
 })

 /*PiGreco*/
app.get('/pigreco', function (req, res) {
   res.render('index',{
      pageTitle: 'Calcolo pi greco', is_pigreco: true
   })
})

app.post('/pigreco', function (req, res) {
   let numero = parseInt(req.body.numero);
   if( isNaN(numero)) 
      res.render('index',{ 
         pageTitle: 'Calcolo numeri primi', is_pigreco: true,
         error:'Inserire un numero valido'
      });
   else
      res.render('index',{ 
         pageTitle: 'Calcolo numeri primi', is_pigreco: true, numero:numero,
         result:pigreco(numero)
      });
})

/*Info*/
app.get('/info', function (req, res) {
   res.render('index',{
      pageTitle: 'Info', is_info: true
   })
})

/*Avvio Server*/
var server = app.listen(process.env.PORT || 8080, function () {
   var host = server.address().address
   var port = server.address().port
})