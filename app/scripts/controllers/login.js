'use strict';

angular.module('rtaApp')
  .controller('LoginCtrl', function ($scope, Firebase, Stories, $location) {
    $scope.storyIndex = [];
    $scope.$on('loggedIn', function(scope, result) {
      if (result != null) {
          Stories.getStoryIndex(function(index){
            _.each(index, function(story, key) {
              if (story.userId == result.id) {
                story.firebaseId = key; 
                $scope.storyIndex.push(story);
              }
            });
            if (!$scope.$$phase) {
              $scope.$apply(function() {
                alertify.success('You are logged in');
                  if (result.displayName == undefined || result.displayName == '') {
                    result.displayName = 'anonymous';
                  }
                $scope.user = result;
                $scope.loggedIn = true;
                NProgress.done();
              });
            }
          });
      }
    });
    $scope.$on('loggedOut', function() {
      if (!$scope.$$phase) {
        $scope.$apply(function() {
          $scope.storyIndex = [];
          $scope.loggedIn = false;
          NProgress.done();
        });
      }
    });
    Firebase.checkLogin();
    function makeId()
    {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }
    $scope.loggedIn = false;
    $scope.logout = function() {
      NProgress.start();
      Firebase.logout();
    }
    $scope.login = function(type) {
      NProgress.start();
      Firebase.login(type);
    }
    $scope.createStory = function() {
      Stories.createStory({
        published: false,
        description: 'a story about . . . ',
        title: $scope.story,
        userId: $scope.user.id,
        sceneId: makeId(),
        author: $scope.user.displayName
       }, function(result) {
        $location.url('/edit-story/' + result);
       });
    }

  });
