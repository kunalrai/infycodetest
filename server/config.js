if(process.env.NODE_ENV === 'develop')
{
  console.log("###using development envoirenemt###");
  module.exports = {
      server: {
              host: '0.0.0.0',
              port: process.env.PORT || 3000
      },
      database: {
          remoteUrl:'mongodb://ikunalrai:mlab135@ds027145.mlab.com:27145/stencil-dev',
          localUrl: 'mongodb://localhost:27017/stencil-dev',
          modulusUrl: 'mongodb://ikunalrai:abc123@jello.modulusmongo.net:27017/roqo2xOb'
      },
  };
}

