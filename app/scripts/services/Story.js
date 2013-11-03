'use strict';

angular.module('rtaApp')
  .factory('Stories', function (Database) {
    // Service logic
    // ..

    // Public API here
    return {
			getStoryInfo: function(storyId, cb) {
        Database.get('stories/' + storyId, cb);
			},
			getStoryIndex: function(cb) {
        Database.get('stories', cb);
			},
			getScene: function(sceneId, cb) {
        Database.get('scenes/' + sceneId, cb);
      },
      saveScene: function(sceneId, sceneData, cb) {
        console.log(sceneData);
        Database.set('scenes/' + sceneId, sceneData, cb);
      },
      addScene: function(sceneData, cb) {
        Database.add('scenes', null, sceneData, cb);
      },
      createStory: function(data, cb) {
        Database.add('stories', null, data, cb);
      },
      saveStory: function(data, cb) {
        Database.set('stories/' + data.firebaseId, data, cb);
      }
    }
  });
