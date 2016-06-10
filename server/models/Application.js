var mongoose = require('mongoose');

var ApplicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  blurbAboutMe: String,
  linkToResume: String,
  linksToProjects: [String]
});

mongoose.model('Application',ApplicationSchema);
