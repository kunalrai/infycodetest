var Todo = require('../models/todo');
var YouTube = require('youtube-node');

function getTodos(res) {
    Todo.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(todos); // return all todos in JSON format
    });
};

module.exports.getTodo = function (req, res) {
    getTodos(res);

};
module.exports.createTodo = function (req, res) {
    // create todo and send back all todos after creation
    // create a todo, information comes from AJAX request from Angular
    Todo.create({
        text: req.params.text,
        done: false
    }, function (err, todo) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        getTodos(res);
    });
};

module.exports.deteteTodo = function (req, res) {
    Todo.remove({
        _id: req.params.todo_id
    }, function (err, todo) {
        if (err)
            res.send(err);

        getTodos(res);
    });


};


module.exports.searchyoutube = function (req, res) {
    var youTube = new YouTube();
    var query = req.params.query;
    console.log(query);
    youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');
    youTube.search(query, 5, function (error, result) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(result);
        }
    });
};
