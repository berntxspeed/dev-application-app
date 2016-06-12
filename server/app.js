var dev = true;

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');

var fs = require('fs');
var mySecret = process.env.MY_SECRET || fs.readFileSync(__dirname + '/private.key');

var mongoose = require('mongoose');
require('./models/Application.js');
require('./models/Users.js');
var Application = mongoose.model('Application');
var port = process.env.PORT || 8081;

//api controllers
var ctrlProfile = require('./controllers/profile.js');
var ctrlApplication = require('./controllers/application.js');
var ctrlAuth = require('./controllers/authentication.js');

var jwt = require('express-jwt');
var auth = jwt({
  secret: mySecret,
  userProperty: 'payload'
});

var candidate = require('./static/candidate.js');
require('./config/passport.js');

var mongoUser = process.env.MONGO_USER || fs.readFileSync(__dirname + '/heroku-mongo.mongocreds').toString().trim().split(':')[0];
var mongoPass = process.env.MONGO_PASS || fs.readFileSync(__dirname + '/heroku-mongo.mongocreds').toString().trim().split(':')[1];
//var mongoURI = 'mongodb://localhost:27017/devJob';
var mongoURI = 'mongodb://'+mongoUser+':'+mongoPass+'@candidate.64.mongolayer.com:10612,candidate.21.mongolayer.com:11112/app52002001';
mongoose.connect(mongoURI, function(err){
  if(err) {
    console.log('failed to connect to mongodb: '+err);
    console.log('using URI : '+mongoURI);
    process.exit(1);
  }
});

app.use( passport.initialize() );
app.use( express.static( path.join(__dirname, '../client') ) );
app.use( bodyParser.json() );

// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

app.get('/',function(req,res){
  res.sendFile( path.join(__dirname,'../client','index.html') );
});

// api routes
app.get('/api/job.json',function(req,res){
  res.json(candidate);
});

app.get('/api/apps.json',auth,ctrlApplication.getApps);
app.post('/api/apply.json',ctrlApplication.apply);

app.get('/api/profile.json',auth,ctrlProfile.profileRead);

// authentication
app.post('/api/register.json', ctrlAuth.register);
app.post('/api/login.json', ctrlAuth.login);

if(!dev){
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.send('error: '+err.message);
  });
}

app.get('*',function(req,res){
  res.sendFile( path.join(__dirname,'../client','index.html') );
});

app.listen(port, function(){
  console.log('listening on port 8081');
});
