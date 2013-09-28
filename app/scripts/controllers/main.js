'use strict';

angular.module('angularAppsApp')
  .controller('MainCtrl', function ($scope, Story, $timeout, $q, $routeParams) {
    $scope.choiceText = "What will you do?";
    $scope.choices = [];
    var storyId = $routeParams.firstScene;
    $scope.storySpeed = 70;
    Mousetrap.bind(['.','>'], function() {
      $scope.storySpeed = $scope.storySpeed / 1.5;
    });
    Mousetrap.bind(['<',','], function() {
      $scope.storySpeed = $scope.storySpeed * 1.5;
    });
    var promises_array = [];
    $scope.scenes = [];
    function loadScene(sceneNumber) {
      Story.getScene(sceneNumber, function(scene) {
        var promise_array = [];
        var this_scene = {
          scene_name: scene.name,
          paragraphs: []
        }
        $scope.scenes.push(this_scene);
        var paragraphs = scene.text;
        for (var p in paragraphs) {
          var defer = $q.defer();
          defer.promise.then(function(p) {
            this_scene.paragraphs.push('');
            function htmlDecode(value){ 
              return $('<div/>').html(value).text(); 
            }
            var current_text = htmlDecode(paragraphs[p]);
            console.log(current_text);
            var type_text = function() {
              var first_letter = current_text.substr(0,1);
              this_scene.paragraphs[this_scene.paragraphs.length-1] += first_letter; 
              current_text = current_text.substr(1);
              $timeout(function() {
                if (current_text.length != 0) {
                  type_text();
                }
                else {
                  $('html, body').animate({scrollTop: $(".scene:last-child div.centering").offset().top - ($(window.top).height() / 3)}, 500);
                  if (promise_array.length > p+1) {
                    promise_array[p+1].resolve(p+1);
                  }
                  else {
                    loadChoice(scene.choice);
                  }
                }
              },$scope.storySpeed);
            } 
            type_text();
          });
          promise_array.push(defer);
        }
        $timeout(function(){
          promise_array[0].resolve(0);
        },0);
      });
    }

    function loadChoice(choice) {
      $scope.choiceText = '';
      $scope.choices = [];
      console.log(choice);
      function bindMousetrap(choice) {
        Mousetrap.bind(choice.key, function() { 
          console.log('Chosen key');
          $scope.choices = [];
          $scope.choiceText = 'Loading . . . ';
          console.log(c);
          console.log(choice.key);
          Mousetrap.unbind(choice.key);
          loadScene(choice.sceneId); 
          _gaq.push(['_trackEvent', 'Story', 'Choice', choices.sceneId]);
        });
      };
      if (choice.length == 0) {
        $scope.choiceText = 'The End';
      }
      else { 
        for (var c in choice) {
          $scope.choices.push(choice[c]);
          bindMousetrap(choice[c]);
        }
      }
    } 

    loadScene(storyId);
  });
