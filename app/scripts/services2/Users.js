'use strict';

angular.module('rtaApp')
  .factory('Users', function (Database, Auth, REST) {
    // Service logic
    // ...
    var _db = 'users/',
    _currentUser = {},
    _methods = {
      resetPassword: function(userId, cb) {
        REST.resetPassword(userId, cb);
      },
      loadUser: function(userId, cb) {
        Database.get(_db + userId, function(userObject) {
          _currentUser = userObject;
          cb(userObject);
        });
      }
    };

    // Public API here
    return {
      addUser: function(userData, cb) {
        Database.add(_db, null, userData, cb);
      },
      removeUser: function(userId, cb) {
        Database.remove(_db + userId, cb);
      },
      loginUser: function(userId, password, cb) {
        Auth.login(userId, password, cb);
      },
      logoutUser: function(cb) {
        Auth.logout(cb);
      },
      resetPassword: function(userId, cb) {
        _methods.resetPassword(userId, cb);
      },
      updateUser: function(userId, userData, cb) {
        Database.update(_db + userId, userData, cb);
      },
      loadUser: function(userId, cb) {
        _methods.loadUser(userId, cb);
      },
      getCurrentUser: function() {
        return _currentUser;
      }
    };
  });
