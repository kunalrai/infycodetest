var Search = require('../controller/todo.server.controller');


module.exports = function (app) {


  app.get('/api/todos', Search.getTodo);

  // create user and send back all todos after creation
  app.post('/api/todos', Search.createTodo);

  // delete a todo
  app.delete('/api/todos/:todo_id', Search.deteteTodo);

  app.get('/api/search/:query', Search.searchyoutube);
};

