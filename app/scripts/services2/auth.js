'use strict';

angular.module('rtaApp')
  .factory('Auth', function (REST, Firebase, LocalStorage) {
    // Service logic
    // ...
    var _user = {
      authObject: null,
      authenticated: true,
      login: function(userId, password, cb) {
        REST.login(userId, password, function(token) {
          if (token) {
            Firebase.authorize(token, function(result) {
              if (result) {
                this.authObject = result;
                this.saveToken(token);
                cb(token);
              }
              else {
                cb(false);
              }
            });
          }
          else {
            cb(false)
          }
        });
      },
      logout: function(cb) {
        this.clearToken();
        cb();
      },
      getToken: function() {
        return LocalStorage.get('token');
      },
      saveToken: function(token) {
        LocalStorage.set('token', token);
      },
      clearToken: function() {
        LocalStorage.remove('token');
      },
    };

    // Public API here
    return {
      isAuthenticated: function() {
        return _user.authenticated;
      },
      login: function(userId, password, cb) {
        _user.login(userId, password, cb);
      },
      logout: function(userId, cb) {
        _user.logout(userId, cb);
      },
      getAuth: function() {
        return _user.authObject;
      }
    };
      
  });
