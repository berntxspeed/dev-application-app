var mongoose = require('mongoose');

var ApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  blurbAboutMe: {
    type: String,
    required: true
  },
  linkToResume: {
    type: String,
    required: true
  },
  linksToProjects: [String]
});

mongoose.model('Application',ApplicationSchema);
