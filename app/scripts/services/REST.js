'use strict';

angular.module('angularAppsApp')
  .factory('REST', function ($http, $timeout) {
    // Service logic
    // ...

    // Public API here
    return {
			getStoryIndex: function(cb) {
				$http({
					method: 'POST',
					data: {},
				url: '/rest/story-index' }).
				success(function(result, status) {
					$timeout(function(){
						cb(result);
					},0)
				});
			},
			getScene: function(sceneId, cb) {
				console.log(sceneId);
				$http({
					method: 'GET',
					url: '/rest/get-scene/' + sceneId.toString() }).
				success(function(result, status) {
					console.log(result);
					$timeout(function(){
						cb(result);
					},0)

				});
			}
    };
  });
