var User = require('../models/user');

function getUsers(res) {
    User.find(function(err, users) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(users); // return all todos in JSON format
    });
}

module.exports.getUsers = function(req, res) {
    getUsers(res);
};

module.exports.createUser = function(req, res) {

    // create a todo, information comes from AJAX request from Angular
    User.create({
        name: req.body.fname + ' ' + req.body.lname,
        email: req.body.email,

    }, function(err, todo) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        getUsers(res);
    });

};

module.exports.deteteUser = function(req, res) {
    User.remove({
        _id: req.params.todo_id
    }, function(err, todo) {
        if (err)
            res.send(err);

        getUsers(res);
    });
};