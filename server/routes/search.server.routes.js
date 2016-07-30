var Search = require('../controller/search.server.controller');


module.exports = function (app) {

  app.get('/api/search/:query', Search.searchyoutube);

  app.get('/google/search/:query', Search.searchgoogle);
  
};

