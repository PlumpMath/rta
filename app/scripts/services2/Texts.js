'use strict';

angular.module('jpAppApp')
  .factory('Texts', function (Database, $location) {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      get: function(cb) {
        Database.get('texts' + $location.path(), function(text) {
          if (text !== undefined && text !== false) {
            cb(text);
          }
          else {
            cb(false);
          }
        });
      }
    };
  });
