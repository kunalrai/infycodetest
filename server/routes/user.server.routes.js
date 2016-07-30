var User = require('../controller/user.server.controller');


module.exports = function(app){
  
    // api ---------------------------------------------------------------------
    // get all user
    app.get('/api/users',User.getUsers);

 // create user and send back all todos after creation
    app.post('/api/users', User.createUser);

       // delete a todo
    app.delete('/api/users/:user_id', User.deteteUser);
  };