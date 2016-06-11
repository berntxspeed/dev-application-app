var mongoose = require('mongoose');
var Application = mongoose.model('Application');
var User = mongoose.model('User');
var jsonChecker = require('./../helpers/checkApplyJSON.js');

module.exports.apply = function(req,res){
  console.log('got request on /apply.json from host: '+req.headers.host+' with user-agent: '+req.headers['user-agent']+
  ' with body of: '+JSON.stringify(req.body));

  if( jsonChecker.checkApplyJSON(req.body) !== 'pass' ){
    //bad request, try again
    return res.status(500).send('bad request:'+jsonChecker.checkApplyJSON(req.body));
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

};

module.exports.getApps = function(req,res){
  if(!req.payload._id){
    res.status(401).json({
      "message" : "UnauthorizedError: job applications data is private"
    });
  } else {
    //otherwise continue
    User
      .findById(req.payload._id)
      .exec(function(err, user) {
        if(!user || !user.email){
          return res.status(401).json({
            "message" : "UnauthorizedError: you must be logged in to view this page"
          });
        }
        //if the user isn't dave or bernt they shouldn't be allowed to access job applications data
        if(user.email !== 'bernt@reddogsw.com' && user.email !== 'david@reddogsw.com'){
          return res.status(401).json({
            "message" : "UnauthorizedError: your user ("+user.email+") is not allowed to view job applications data"
          });
        }
        //otherwise continue
        Application.find(function(err,apps){
          if(err) return res.status(500).send('server error, could not retrieve applications from db');

          res.json(apps);
        });
      });
  }
};
