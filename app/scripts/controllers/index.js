'use strict';

angular.module('angularAppsApp')
  .controller('IndexCtrl', function ($scope, stories) {
		$scope.stories = stories;
  });

