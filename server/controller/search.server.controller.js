var Todo = require('../models/todo');
var YouTube = require('youtube-node');
var books = require('google-books-search');


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

module.exports.searchgoogle = function (req, res) {
    var youTube = new YouTube();
    var query = req.params.query;
    console.log(query);
    books.search(query, function (error, results) {
        if (!error) {
            res.json(results);
        } else {
            console.log(error);
        }
    });
};
