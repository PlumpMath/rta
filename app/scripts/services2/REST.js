'use strict';

angular.module('rtaApp')
  .factory('REST', function ($http, Configs) {
    // Service logic
    // ...
    var _rest = {
      endpoint: 'http://' + Configs.restServer.url + ':' + Configs.restServer.port + '/' + Configs.restServer.path + '/',
      testpoint: 'http://localhost:9000/rest/',
      login: function(userId, password, cb) {
        $http({
          method: 'POST',
          data: {
            userId: userId,
            password: password
          },
          url: this.testpoint  + 'login'
        }).
        success(function(token) {
          if (token !== 'false') {
            cb(JSON.parse(token));
          }
          else {
            cb(false);
          }
        });
      },
      resetPassword: function(userId, cb) {
        $http({
          method: 'POST',
          data: {
            userId: userId,
          },
          url: this.testpoint  + 'password-reset'
        }).
        success(function(result) {
          cb(result);
        });
      }
    };

    // Public API here
    return {
      login: function(userId, password, cb) {
        _rest.login(userId, password, cb);
      },
      resetPassword: function(userId, cb) {
        _rest.resetPassword(userId, cb);
      }
    };
  });
