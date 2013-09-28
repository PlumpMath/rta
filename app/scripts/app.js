'use strict';

angular.module('angularAppsApp', ['ngRoute', 'ngTouch'])
.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
	.when('/story/:firstScene', {
		templateUrl: 'views/main.html',
		controller: 'MainCtrl'
	})
	.when('/index', {
		templateUrl: 'views/index.html',
		controller: 'IndexCtrl',
		resolve: {
			stories: ['$q', 'REST', function($q, REST) {
				var defer = $q.defer();
				var cb =  function(index) {
					defer.resolve(index);
				}
				REST.getStoryIndex(function(index){
					cb(index);
				});
				return defer.promise;
			}]
		}
	})
	.otherwise({
		redirectTo: '/index'
	});
}]);
