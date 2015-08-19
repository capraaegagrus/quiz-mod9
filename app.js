var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');
var sessionController = require('./controllers/session_controller');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz-2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));



//Helpers dinámicos:
app.use(function (req, res, next){
  //gardar path en session.redir para despois de login
  if (!req.path.match(/\/login|\/logout/)){
    req.session.redir = req.path;
  }

  //Facer visible req.session nas vistas
  res.locals.session = req.session;
  next();
});

//Auto log-out
app.use(function (req, res, next){
  //Comprobamos si existe a sesión
  if (req.session.user) {
    var horaActual= new Date().getTime();
    //Calculamos o tempo transcurrido dende a última transacción (ms)
    var tempoDendeUltimaTransaccion = horaActual-req.session.user.hour;
    console.log("Hora actual: "+horaActual);
    console.log("Hora última transacción: "+ req.session.user.hour);
    //Comprobamos si pasaron 2 min dende a última transacción
    if (tempoDendeUltimaTransaccion>120000){ 
      res.redirect("/logout");
      console.log("Sesión destruida");
    }
    //Gardamos a hora da última transacción
    req.session.user.hour=horaActual;
  }
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
