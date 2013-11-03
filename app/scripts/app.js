'use strict';

angular.module('rtaApp', ['ngRoute', 'ngTouch'])
.config(['$routeProvider', '$sceProvider', function ($routeProvider) {
	$routeProvider
	.when('/story/:storyId', {
		templateUrl: 'views/main.html',
		controller: 'MainCtrl',
		resolve: {
			storyInfo: ['$q', 'Stories', '$route', function($q, Stories, $route) {
				var defer = $q.defer();
				var cb =  function(index) {
					defer.resolve(index);
				}
				Stories.getStoryInfo($route.current.params.storyId, function(index){
					cb(index);
				});
				return defer.promise;
			}]
		}
	})
	.when('/index', {
		templateUrl: 'views/index.html',
		controller: 'IndexCtrl',
		resolve: {
			stories: ['$q', 'Stories', function($q, Stories) {
				var defer = $q.defer();
				var cb =  function(index) {
					defer.resolve(index);
				}
				Stories.getStoryIndex(function(index){
					cb(index);
				});
				return defer.promise;
			}]
		}
	})
  .when('/edit-story/:storyId', {
    templateUrl: 'views/edit-story.html',
    controller: 'EditStoryCtrl',
		resolve: {
			storyInfo: ['$q', 'Stories', '$route', function($q, Stories, $route) {
				var defer = $q.defer();
				var cb =  function(index) {
					defer.resolve(index);
				}
				Stories.getStoryInfo($route.current.params.storyId, function(index){
					cb(index);
				});
				return defer.promise;
			}]
		}
  })
.when('/login', {
  templateUrl: 'views/login.html',
  controller: 'LoginCtrl'
})
	.otherwise({
		redirectTo: '/index'
	});
}]);
