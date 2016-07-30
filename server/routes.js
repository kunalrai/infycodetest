

module.exports = function(app) {

    require("./routes/user.server.routes")(app);
    require("./routes/todo.server.routes")(app);

   

};