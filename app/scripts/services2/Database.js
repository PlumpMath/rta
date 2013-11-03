'use strict';

angular.module('rtaApp')
.factory('Database', function (Auth, Firebase) {
  // Service logic
  // ...
  function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }

  var _db = {
    database: Firebase,
    call: function(fn, args) {
      NProgress.start();
      function insertFunction(args, v) {
        return function(result) {
          NProgress.done();
          args[v].call(null, result);
        };
      }
      var newCb = null;
      var newArgs = [];
      for (var v in args) {
        if (isFunction(args[v])) {
          newCb = insertFunction(args, v);
          newArgs.push(newCb);
        }
        else {
          newArgs.push(args[v]);
        }
      }
      this.database[fn].apply(this.database, newArgs);
    }
  };

  // Public API here
  return {
    get: function(id, cb) {
      if (Auth.isAuthenticated()) {
        _db.call('get', [id, cb]);
      }
      else {
        cb(false);
      }
    },
    getStream: function(id, cb) {
      if (Auth.isAuthenticated()) {
        _db.call('getStream', [id, cb]);
      }
      else {
        cb(false);
      }
    },
    // updating is bool
    set: function(id, value, cb) {
      console.log(value);
      if (Auth.isAuthenticated()) {
        _db.call('set', [id, value, cb]);
      }
      else {
        cb(false);
      }
    },
    update: function(id, value, cb) {
      if (Auth.isAuthenticated()) {
        _db.call('update', [id, value, cb]);
      }
      else {
        cb(false);
      }
    },
    remove: function(id, cb) {
      if (Auth.isAuthenticated()) {
        _db.call('remove', [id, cb]);
      }
      else {
        cb(false);
      }
    },
    // setId is optional string 
    add: function(parentId, setId, value, cb) {
      if (Auth.isAuthenticated()) {
        _db.call('add', [parentId, setId, value, cb]);
      }
      else {
        cb(false);
      }
    },
  };
});
