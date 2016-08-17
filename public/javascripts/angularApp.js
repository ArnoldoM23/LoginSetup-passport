
var app = angular.module('LoginSetup', ['ui.router', 'Authentication']);

app.config(['$stateProvider', '$urlRouterProvider',  function($stateProvider, $urlRouterProvider){
	

	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl',
			onEnter: ['$state', 'Auth', function($state, Auth){
		    if(!Auth.isLoggedIn()){
		      $state.go('login');
		    }
		  }]
		})

		.state('login', {
		  url: '/login',
		  templateUrl: '/login.html',
		  controller: 'AuthCtrl',
		  // This will check is the route is authenticated before goes to it
		  onEnter: ['$state', 'Auth', function($state, Auth){
		    if(Auth.isLoggedIn()){
		      $state.go('home');
		    }
		  }]
		})

		.state('signup', {
		  url: '/signup',
		  templateUrl: '/signup.html',
		  controller: 'AuthCtrl',
		  onEnter: ['$state', 'Auth', function($state, Auth){
		    if(Auth.isLoggedIn()){
		      $state.go('home');
		    }
		  }]
		});

	$urlRouterProvider.otherwise('home');

}]);

app.controller('MainCtrl', ['$scope', '$http', 'Auth', function($scope, $http, Auth){

	$scope.isLoggedIn = Auth.isLoggedIn;
  $scope.currentUser = Auth.currentUser;
  $scope.logOut = Auth.logOut;
// Example for post
	$scope.myCar = {
		car: 'Laferrari',
		nickname: 'TheBest'
	}

	$scope.postingExample = function(){

	  return $http.post('/postingExample', $scope.myCar, {
	  	 headers: {Authorization: 'Bearer ' + Auth.getToken()}
	  }).success(function(data) {
	    console.log('Your car was added to garage', data);
	  });

	}

}]);

app.controller('AuthCtrl', ['$scope', '$state','Auth',function($scope, $state, Auth){
	$scope.isLoggedIn = Auth.isLoggedIn;
  $scope.currentUser = Auth.currentUser;
  $scope.logOut = Auth.logOut;
  $scope.user = {};

  $scope.signup = function(){
    Auth.signup($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    Auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}]);












