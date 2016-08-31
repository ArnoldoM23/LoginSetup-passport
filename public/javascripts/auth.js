angular.module('Authentication', [])
.factory('Auth', ['$http', '$window', '$location' , function($http, $window, $location){
  var Auth = {};
  Auth.saveToken = function (token){
    $window.localStorage['Login-setup'] = token;
  };
  Auth.getToken = function (){
    return $window.localStorage['Login-setup'];
  }
  Auth.isLoggedIn = function(){
    var token = Auth.getToken();
    if(token){
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };
  Auth.currentUser = function(){
    if(Auth.isLoggedIn()){
      var token = Auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload.id;
    }
  };
  Auth.signup = function(user){
    console.log('in the factory', user)
    return $http.post('/signup', user).success(function(data){
      Auth.saveToken(data.token);
    });
  };
  Auth.logIn = function(user){
    return $http.post('/login', user).success(function(data){
      Auth.saveToken(data.token);
      $location.path('/home')
    });
  };
  Auth.logOut = function(){
    $window.localStorage.removeItem('Login-setup');
    $location.path('/login')
  };
  Auth.facebook = function(user){
    return $http.get('/auth/facebook').success(function(data){
      console.log('get in auth angular====',data)
      Auth.saveToken(data.token);
      $location.path('/home')
    });
  };
  return Auth;
}])
