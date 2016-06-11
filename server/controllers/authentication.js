var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.register = function(req, res) {
  var user = new User();

  if (!req.body.name || typeof(req.body.name) !== 'string') {
    res.status(404).send('bad name parameter');
    return;
  }
  if (!req.body.email || typeof(req.body.email) !== 'string') {
    res.status(404).send('bad email parameter');
    return;
  }
  if (!req.body.password || typeof(req.body.password) !== 'string') {
    res.status(404).send('bad password parameter');
    return;
  }

  user.name = req.body.name;
  user.email = req.body.email;

  user.setPassword(req.body.password);

  user.save(function(err) {
    //if we couldnt save the user, possibly due to the email being already taken
    if(err) return res.status(401).json({
      "message" : "UnauthorizedError: already a user by that name.",
    });
    //otherwise continue
    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      "token" : token
    });
  });
};

module.exports.login = function(req, res) {

  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};
