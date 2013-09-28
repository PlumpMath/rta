'use strict';

angular.module('angularAppsApp')
  .factory('Story', function (REST) {
    // Service logic
    // ..

    // Public API here
    return {
			getScene: function(number, cb) {
				console.log('Making rest request');
				// return story_scenes[number];
				console.log(number);
				REST.getScene(number, function(result) {
					console.log('Returning scene');
					console.log(result);
					cb(result);
				});
			}
    };
  });
