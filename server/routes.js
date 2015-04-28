'use strict';

var config = require('./config/environment');

module.exports = function (app) {

  // API
  app.use('/api/phones', require('./api/phone'));
  app.use('/api/profiles', require('./api/profile'));
  app.use('/api/notes', require('./api/note'));
  app.use('/api/conversations', require('./api/conversation'));
  app.use('/api/users', require('./api/user'));
  // app.post('/api/photo',function(req,res){
  //   console.log(req.files);
  //   res.end("File uploaded.");
  // });

  // Auth
  app.use('/auth', require('./auth'));

  app.route('/:url(api|app|bower_components|assets)/*')
    .get(function (req, res) {
      res.redirect("/login");
    });

  app.route('/*')
    .get(function (req, res) {
      res.sendFile(
        app.get('appPath') + '/index.html',
        { root: config.root }
      );
    });
    

};
