var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
require('./models/Application.js');
var Application = mongoose.model('Application');
var port = process.env.PORT || 8081;

var candidate = require('./static/candidate.js');

function validEmail(email){
  var x = email;
  var atpos = x.indexOf("@");
  var dotpos = x.lastIndexOf(".");
  if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
    return false;
  }
  return true;
}

function checkApplyJSON(jsonToCheck){
  if( !jsonToCheck.name || typeof(jsonToCheck.name) !== 'string' ) return 'non-existent or invalid parameter - name';
  if( !jsonToCheck.email || typeof(jsonToCheck.email) !== 'string' || !validEmail(jsonToCheck.email) ) return 'non-existent or invalid parameter - email';
  if( !jsonToCheck.blurbAboutMe || typeof(jsonToCheck.blurbAboutMe) !== 'string' ) return 'non-existent or invalid parameter - blurbAboutMe';
  if( !jsonToCheck.linkToResume || typeof(jsonToCheck.linkToResume) !== 'string' ) return 'non-existent or invalid parameter - linkToResume';
  if( !jsonToCheck.linksToProjects || !Array.isArray(jsonToCheck.linksToProjects) ) return 'non-existent or invalid parameter - linksToProjects';
  return 'pass';
}

mongoose.connect('mongodb://devUser1:Zx10fxdl@candidate.64.mongolayer.com:10612,candidate.21.mongolayer.com:11112/app52002001', function(err){
  if(err) {
    console.log('failed to connect to mongodb');
    process.exit(1);
  }
});

app.use( express.static('client') );
app.use( bodyParser.json() );

app.get('/job.json',function(req,res){
  res.json(candidate);
});

app.post('/apply.json',function(req,res){
  console.log('got request on /apply.json from host: '+req.headers.host+' with user-agent: '+req.headers['user-agent']+
  ' with body of: '+JSON.stringify(req.body));

  if( checkApplyJSON(req.body) !== 'pass' ){
    //bad request, try again
    return res.status(500).send('bad request:'+checkApplyJSON(req.body));
  }

  var application = new Application;
  application.name = req.body.name;
  application.email = req.body.email;
  application.blurbAboutMe = req.body.blurbAboutMe;
  application.linkToResume = req.body.linkToResume;
  application.linksToProjects = req.body.linksToProjects;

  application.save(function(err){
    if(err) return res.status(500).send('error writing to db');

    return res.send('thanks for applying, you will be hearing back from us soon');
  });

});

app.listen(port, function(){
  console.log('listening on port 8081');
});
