'use strict';

angular.module('rtaApp')
  .controller('EditStoryCtrl', function ($scope, Stories, $timeout, $q, $routeParams, storyInfo, $sce) {
    $scope.editingMeta = false;
    $scope.editMeta = function() {
      $scope.editingMeta = true;
    }
    $scope.saveMeta = function() {
      $scope.editingMeta = false;
      Stories.saveStory(storyInfo, function(){
        alertify.success('Story saved');
      });
    }
    $scope.publishStory = function(publish) {
      console.log(storyInfo);
      $scope.story.published = publish;
      Stories.saveStory(storyInfo, function(){
        alertify.success('Story saved');
      });
    }
    $scope.vars = {};
    $scope.$on('loggedIn', function(scope, result) {
      console.log('Loggin in');
      if (result != null) {
          $scope.$apply(function() {
            $scope.user = result;
            $scope.loggedIn = true;
          });
      }
    });
    $scope.showEditScene = {};
    $scope.showEditChoices = {};
    Mousetrap.bind('b', function() { 
      loadLastScene();
    });
    var lastScenes = [];
    $scope.story = storyInfo;
    $scope.trigger = function(val) {
      Mousetrap.trigger(val);
    };
    $scope.choiceText = $sce.trustAsHtml('What will you do?');
    $scope.choices = [];
    var firstSceneId = storyInfo.sceneId;
    $scope.storySpeed = 70;
    Mousetrap.bind(['.','>'], function() {
      $scope.storySpeed = $scope.storySpeed / 1.5;
    });
    Mousetrap.bind(['<',','], function() {
      $scope.storySpeed = $scope.storySpeed * 1.5;
    });
    $scope.scenes = [];
    function loadScene(sceneNumber) {
      Stories.getScene(sceneNumber, function(scene) {
        if (scene == false) {
          scene = {};
          scene.title = "Scene Title";
          scene.text = ["Scene Text"];
          scene.choices = [];
          wordCount: 0;
        }
        scene.sceneId = sceneNumber;
        if (scene.choice == null) {
          scene.choice = [];
        }
        lastScenes.push(scene);
        if ($(".scene:last-child").offset() != undefined) {
          $timeout(function(){
            $('html, body').animate({scrollTop: $(".scene:last-child").offset().top}, 500);
          }, 100);
        }
        else {
          $timeout(function(){
            $('html, body').animate({scrollTop: 0}, 500);
          }, 100);
        }
        var promise_array = [];
        if (typeof scene.text == 'string') {
          // Legacy
          var this_scene = {
            title: scene.title,
            text: scene.text.split('*p*'),
            choice: scene.choice,
            id: sceneNumber,
            original: scene
          }
        }
        else {
          // Current
          var this_scene = {
            title: scene.title,
            text: scene.text,
            choice: scene.choice,
            id: sceneNumber,
            original: scene,
            wordCount: scene.text.join('\n').split(' ').length 
          }
        }
        $timeout(function(){
          $scope.scenes.push(this_scene);
        },0);
        loadChoice(scene.choice, this_scene);
        });
    }
    $scope.clickChoice = function(sceneId) {
      $scope.choices = [];
      $scope.choiceText = $sce.trustAsHtml('Loading . . . ');
      loadScene(sceneId); 
    }
    function bindMousetrap(choice) {
    };

    function loadChoice(choice, scene) {
      $scope.choicesSceneId = scene.id;
      $scope.currentScene = scene.original;
      $scope.choiceText = $sce.trustAsHtml('');
      $scope.choices = [];
      if (choice.length == 0) {
        $scope.getMore = true;
        $scope.choiceText = $sce.trustAsHtml('<p>The End</p>');
      }
      else { 
        for (var c in choice) {
          $scope.choices.push(choice[c]);
          bindMousetrap(choice[c]);
        }
      }
    } 
    function loadLastScene() {
      $timeout(function() {
        $scope.scenes.pop();    
        $scope.scenes.pop();
        var last = lastScenes.pop();
        last = lastScenes.pop();
        loadScene(last.sceneId);
        // loadChoice(nextLastScene.choice, nextLastScene);
      },0);
    }
    $scope.goBack = function() {
      $scope.trigger('b');
    }
    loadScene(firstSceneId);

    $scope.editStory = function() {
    }

    $scope.editScene = function(scene) {
      var text = angular.copy(scene.text);
      $scope.updatedTitle = scene.title;
      $scope.updatedText = text.join("\n\n");
      $scope.showEditScene[scene.title] = true;
    }

    $scope.editChoices = function(choices) {
      $scope.updatedChoices = angular.copy(choices);
      $scope.showEditChoices[$scope.choicesSceneId] = true;
      $scope.noMoreChoices = true;
    }

    $scope.saveChoices = function(choices) {
      var notCont = true;
      $scope.noMoreChoices = true;
      var newScene = angular.copy($scope.currentScene);
      var newArray = [];
      for (var i in choices) {
        if (choices[i].description !== '') {
          choices[i].key = choices[i].description;
          newArray.push(choices[i]);  
        }
      }
      choices = newArray;
      for (var i in choices) {
        if (choices[i].sceneId == null) {
          Stories.addScene({
            title: choices[i].description,
            text: [''],
            choice: {}
          }, function(firebaseId) {
            choices[i].sceneId = firebaseId;
            bindMousetrap(choices[i]);
            contSaveChoice(newScene, choices); 
          });
          notCont = false;
        }
      }
      if (notCont) {
          contSaveChoice(newScene, choices); 
      }
    }

    function contSaveChoice(newScene, choices) {
      newScene.choice = choices;      
      $scope.choices = choices;
      if (newScene.firebaseId != null) delete newScene.firebaseId;
      if (newScene.id != null) delete newScene.id;
      Stories.saveScene($scope.choicesSceneId, newScene, function(result){
        $scope.$apply(function() {
          alertify.success('Saved');
          delete $scope.updatedChoices;
          delete $scope.showEditChoices[$scope.choicesSceneId];
          for (var s in $scope.scenes) {
            if ($scope.scenes[s].id == $scope.choicesSceneId) {
              console.log($scope.scenes[s]);
              console.log(newScene);
              var this_scene = {
                title: newScene.title,
                text: newScene.text,
                choice: newScene.choice,
                id: $scope.choicesSceneId,
                original: newScene,
                wordCount: newScene.text.join('\n').split(' ').length 
              }
              $scope.scenes[s] = this_scene;
              $scope.showEditScene[this_scene.title] = false;
            }
          }
        });
      });
    } 

    $scope.addChoice = function() {
      $scope.noMoreChoices = false;
      $scope.updatedChoices.push({
        key: '',
        description: ''
      });
    }

    $scope.updateText = function(scene, text) {
      scene.text = text.split("\n\n");
      scene.wordCount = text.split(' ').length;
      $scope.updatedText = text;
    }
    
    $scope.updateTitle = function(scene, title) {
      $scope.updatedTitle = title;
    }
    
    $scope.saveScene = function(scene) {
      var newScene = angular.copy(scene.original);
      newScene.text = $scope.updatedText.split("\n\n");
      console.log($scope.updatedTitle);
      newScene.title = $scope.updatedTitle;
      scene.title = newScene.title;
      console.log(newScene);
      $scope.currentScene.text = newScene.text;
      $scope.currentScene.title = newScene.title;
      Stories.saveScene(scene.id, newScene, function(result){
        alertify.success('Saved');
        $scope.$apply(function() {
          delete $scope.showEditScene[scene.title];
        });
      });
    }
  });
