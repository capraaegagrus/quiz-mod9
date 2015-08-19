
//MW de autorización de accesos HTTP restrinxidos
exports.loginRequired = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Get /login --Formulario de login
exports.new = function (req, res){
  var errors = req.session.errors || {};
  req.session.errors = {};

  res.render ('sessions/new', {errors: errors});
};

//POST /login --Crear a sesión
exports.create = function (req,res) {
  var login = req.body.login;
  var password = req.body.password;
  var userController = require ('./user_controller');
  
  

  userController.autenticar(login, password, function (error, user) {
    if (error) { //si hai erro retornamos mensaxes de erro de sesión
      req.session.errors = [{"message": 'Se ha producido un error: ' +error}];
      res.redirect("/login");
      return;
    }
    //Hora de creación da sesión en milisegundos
    var hora = new Date().getTime();
    //Crear req.session.user e gardar campos id e username
    //A sesión defínese pola existencia de: req.session.user
    req.session.user = {id:user.id, username: user.username, hour: hora};
    res.redirect(req.session.redir.toString()); //redirección a path anterior a login
  });
};

//DELETE /logout --Destruir sesión
exports.destroy = function (req, res) {
  delete req.session.user;
  res.redirect("/login"); //redirección a /login para previr erros o estar situado en accións de usuarios autenticados
};

