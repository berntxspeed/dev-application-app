//main.js
(function () {

  angular.module('meanApp', ['ngRoute']);

  function config ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/home/home.view.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
      })
      .when('/register', {
        templateUrl: '/auth/register/register.view.html',
        controller: 'registerCtrl',
        controllerAs: 'vm'
      })
      .when('/login', {
        templateUrl: '/auth/login/login.view.html',
        controller: 'loginCtrl',
        controllerAs: 'vm'
      })
      .when('/profile', {
        templateUrl: '/profile/profile.view.html',
        controller: 'profileCtrl',
        controllerAs: 'vm'
      })
      .otherwise({redirectTo: '/'});

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
  }

  function run($rootScope, $location, authentication) {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
      if ($location.path() === '/profile' && !authentication.isLoggedIn()) {
        $location.path('/');
      }
    });
  }

  angular
    .module('meanApp')
    .config(['$routeProvider', '$locationProvider', config])
    .run(['$rootScope', '$location', 'authentication', run]);

})();

//login.controller.js
(function () {

  angular
  .module('meanApp')
  .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$location', 'authentication'];
  function loginCtrl($location, authentication) {
    var vm = this;

    vm.credentials = {
      email : "",
      password : ""
    };

    vm.onSubmit = function () {
      authentication
        .login(vm.credentials)
        .error(function(err){
          alert(err);
        })
        .then(function(){
          $location.path('profile');
        });
    };

  }

})();

//register.controller.js
(function () {

  angular
    .module('meanApp')
    .controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['$location', 'authentication'];
  function registerCtrl($location, authentication) {
    var vm = this;

    vm.credentials = {
      name : "",
      email : "",
      password : ""
    };

    vm.onSubmit = function () {
      console.log('Submitting registration');
      authentication
        .register(vm.credentials)
        .error(function(err){
          alert(err);
        })
        .then(function(){
          $location.path('profile');
        });
    };

  }

})();

//navigation.controller.js
(function () {

  angular
    .module('meanApp')
    .controller('navigationCtrl', navigationCtrl);

  navigationCtrl.$inject = ['$location','authentication'];
  function navigationCtrl($location, authentication) {
    var vm = this;

    vm.isLoggedIn = authentication.isLoggedIn();

    vm.currentUser = authentication.currentUser();

  }

})();

//navigation.directive.js
(function () {

  angular
    .module('meanApp')
    .directive('navigation', navigation);

  function navigation () {
    return {
      restrict: 'EA',
      templateUrl: '/common/directives/navigation/navigation.template.html',
      controller: 'navigationCtrl as navvm'
    };
  }

})();

//authentication.service.js
(function () {

  angular
    .module('meanApp')
    .service('authentication', authentication);

  authentication.$inject = ['$http', '$window'];
  function authentication ($http, $window) {

    var saveToken = function (token) {
      $window.localStorage['mean-token'] = token;
    };

    var getToken = function () {
      return $window.localStorage['mean-token'];
    };

    var isLoggedIn = function() {
      var token = getToken();
      var payload;

      if(token){
        payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    var currentUser = function() {
      if(isLoggedIn()){
        var token = getToken();
        var payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        return {
          email : payload.email,
          name : payload.name
        };
      }
    };

    register = function(user) {
      return $http.post('/api/register.json', user)
        .success(function(data){
        saveToken(data.token);
      });
    };

    login = function(user) {
      return $http.post('/api/login.json', user).success(function(data) {
        saveToken(data.token);
      });
    };

    logout = function() {
      $window.localStorage.removeItem('mean-token');
    };

    return {
      currentUser : currentUser,
      saveToken : saveToken,
      getToken : getToken,
      isLoggedIn : isLoggedIn,
      register : register,
      login : login,
      logout : logout
    };
  }


})();

//data.service.js
(function() {

  angular
    .module('meanApp')
    .service('meanData', meanData);

  meanData.$inject = ['$http', 'authentication'];
  function meanData ($http, authentication) {

    var getProfile = function () {
      return $http.get('/api/profile.json', {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };

    var getApps = function () {
      return $http.get('/api/apps.json', {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };

    return {
      getProfile : getProfile,
      getApps : getApps
    };
  }

})();

//home.controller.js
(function() {

  angular
    .module('meanApp')
    .controller('homeCtrl', homeCtrl);

    function homeCtrl () {
      console.log('Home controller is running');
    }

})();

//profile.controller.js
(function() {

  angular
    .module('meanApp')
    .controller('profileCtrl', profileCtrl);

  profileCtrl.$inject = ['$location', 'meanData'];
  function profileCtrl($location, meanData) {
    var vm = this;

    vm.user = {};

    vm.refreshApplications = function(alert){
      meanData.getApps()
        .success(function(data) {
          vm.admin = true;
          vm.apps = data;
          if(alert) alert('Updated Applications!');
        })
        .error(function(e){
          vm.admin = false;
          console.log(e);
          if(alert) alert('error updating applications');
        });
    }

    meanData.getProfile()
      .success(function(data) {
        vm.authenticated = true;
        vm.user = data;
      })
      .error(function (e) {
        vm.authenticated = false;
        console.log(e);
      });

    vm.refreshApplications();

  }

})();
