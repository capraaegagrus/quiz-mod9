
var users = { admin: {id:1, username:"admin", password:"1234"},
              pepe: {id:2, username:"pepe", password:"5678"}
             };

// Comproba si o usuario está rexistrado en users
//Si a autentificación falla ou hai erros, execútase o callback(error)
exports.autenticar = function (login, password, callback) {
  if (users[login]){
    if (password === users[login].password){
      callback(null, users[login]);
    } else {
      callback(new Error('Password erróneo.'));}
  } else { callback(new Error ('Non existe o usuario.'));}
};

