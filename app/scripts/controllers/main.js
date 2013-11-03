'use strict';

angular.module('rtaApp')
  .controller('MainCtrl', function ($scope, Stories, $timeout, $q, $routeParams, storyInfo, $sce) {
    var lastScene = null;
    var secondLastScene = null;
    var storySpeedMult = 1;
    $scope.story = storyInfo;
    $scope.choiceText = $sce.trustAsHtml('Loading . . . ');
    $scope.choices = [];
    var firstSceneId = storyInfo.sceneId;
    $scope.storySpeed = 70;
    Mousetrap.bind(['.','>'], function() {
      $scope.storySpeed = $scope.storySpeed / 1.5;
    });
    Mousetrap.bind(['<',','], function() {
      $scope.storySpeed = $scope.storySpeed * 1.5;
    });
    var promises_array = [];
    $scope.scenes = [];
    $scope.choiceHistory = [];
    function loadScene(sceneNumber) {
      Stories.getScene(sceneNumber, function(scene) {
        console.log(scene.choice);
        if (scene.choice == null || scene.choice == undefined) {
          scene.choice = [];
        }
        console.log(scene.choice);
        lastScene = secondLastScene;
        secondLastScene = scene;
        var promise_array = [];
        var this_scene = {
          title: scene.title,
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
            var type_text = function() {
              var first_letter = current_text.substr(0,1);
              this_scene.paragraphs[this_scene.paragraphs.length-1] += first_letter; 
              if (first_letter == ',' || first_letter == '.') {
                storySpeedMult = 4;
              }
              else {
                storySpeedMult = 1;
              }
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
                    $scope.choiceHistory.push(angular.copy(scene.choice));
                    loadChoice(scene.choice);
                  }
                }
              },$scope.storySpeed * storySpeedMult);
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
    $scope.clickChoice = function(sceneId) {
        $scope.choices = [];
        $scope.choiceText = $sce.trustAsHtml('Loading . . . ');
        loadScene(sceneId); 
        // _gaq.push(['_trackEvent', 'Story', 'Choice', choice.sceneId]);
    }
    function loadChoice(choice) {
      $scope.choiceText = $sce.trustAsHtml('');
      $scope.choices = [];
      if (choice.length == 0) {
        $scope.choiceText = $sce.trustAsHtml('<p>The End</p>');
        $scope.getMore = true;
      }
      else { 
        $scope.choiceText = $sce.trustAsHtml('');
        for (var c in choice) {
          $scope.choices.push(choice[c]);
        }
      }
      if ($scope.scenes.length > 1) {
      }
      $('html, body').animate({scrollTop: $(".scene:last-child div.centering").offset().top - ($(window.top).height() / 3)}, 500);
    } 
    $scope.goBack = function() {
      $timeout(function() {
        $scope.getMore = false;
        $scope.scenes.pop();    
        console.log($scope.choiceHistory);
        $scope.choiceHistory.pop();
        loadChoice($scope.choiceHistory[$scope.choiceHistory.length-1]);
      },0);
    }
    loadScene(firstSceneId);
  });
