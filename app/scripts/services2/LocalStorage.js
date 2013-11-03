'use strict';

angular.module('rtaApp')
  .factory('LocalStorage', function () {
    // Service logic
    // ...
    var _ls = {
      set: function(key, value) {
        return localStorage.setItem(key, value);
      },
      get: function(key) {
        return localStorage.getItem(key);
      },
      remove: function(key) {
        return localStorage.removeItem(key);
      }
    };

    // Public API here
    return {
      set: function(key, value) {
        return _ls.set(key, value);
      },
      get: function(key) {
        return _ls.get(key);
      },
      remove: function(key) {
        return _ls.remove(key);
      }
    };
  });
