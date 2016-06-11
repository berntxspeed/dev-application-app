module.exports.checkApplyJSON = function (jsonToCheck){
  if( !jsonToCheck.name || typeof(jsonToCheck.name) !== 'string' ) return 'non-existent or invalid parameter - name';
  if( !jsonToCheck.email || typeof(jsonToCheck.email) !== 'string' || !validEmail(jsonToCheck.email) ) return 'non-existent or invalid parameter - email';
  if( !jsonToCheck.blurbAboutMe || typeof(jsonToCheck.blurbAboutMe) !== 'string' ) return 'non-existent or invalid parameter - blurbAboutMe';
  if( !jsonToCheck.linkToResume || typeof(jsonToCheck.linkToResume) !== 'string' ) return 'non-existent or invalid parameter - linkToResume';
  if( !jsonToCheck.linksToProjects || !Array.isArray(jsonToCheck.linksToProjects) ) return 'non-existent or invalid parameter - linksToProjects';
  return 'pass';
};

function validEmail(email){
  var x = email;
  var atpos = x.indexOf("@");
  var dotpos = x.lastIndexOf(".");
  if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
    return false;
  }
  return true;
}
