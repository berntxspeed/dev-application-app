(function(){
  var app = angular.module('jobApplication',[]);

  app.controller('adminController',['$http',function($http){
      var adminView = this;
      adminView.apps = [];
      $http.get('/api/apps.json').success(function(data){
        adminView.apps = data;
      });
  }]);

})();
