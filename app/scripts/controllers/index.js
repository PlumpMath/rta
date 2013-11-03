'use strict';

angular.module('rtaApp')
  .controller('IndexCtrl', function ($scope, stories) {
    delete stories.firebaseId;
		$scope.stories = stories;
  });

