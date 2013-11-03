'use strict';

angular.module('rtaApp')
  .factory('Firebase', function (Configs, $timeout, $rootScope) {
    // Service logic
    // ...
    var firebaseUser = null;
    var _db = new Firebase('https://' + Configs.firebase.dbName + '.firebaseio.com/' + Configs.firebase.dbRoot + '/');
    var auth = new FirebaseSimpleLogin(_db, function(error, user) {
          if (error) {
            // an error occurred while attempting login
          } else if (user) {
            // user authenticated with Firebase
            firebaseUser = user;
            $rootScope.$broadcast('loggedIn', user);
          } else {
            firebaseUser = null;
            $rootScope.$broadcast('loggedOut');
          }
        });
    var _methods = {
      checkLogin: function() {
        if (firebaseUser == null) {
          $rootScope.$broadcast('loggedOut');
        }
        else {
          $rootScope.$broadcast('loggedIn', firebaseUser);
        }
      },
      login: function(type) {
        auth.login(type, {
          rememberMe: true
        });
      },
      logout: function() {
        auth.logout();
      },
      getUser: function(cb) {
        cb(firebaseUser);
      },
      authorize: function(token, cb) {
        _db.auth(token, cb);
      },
      valueOn: function(id, cb) {
        _db.child(id).on('value', function(ss) {
          var name = ss.name();
          var value = (ss.val() != null) ? ss.val() : false;
          value.firebaseId = name;
          cb(value);
        });
      },
      valueOnce: function(id, cb) {
        _db.child(id).once('value', function(ss) {
          var name = ss.name();
          var value = (ss.val() != null) ? ss.val() : false;
          value.firebaseId = name;
          cb(value);
        });
      },
      valueUpdate: function(id, value, cb) {
        if (firebaseUser == null) {
          alert('You are not logged in. Reload and try logging in.');
        }
        else {
          value.userId = firebaseUser.id;
          var refId = value.firebaseId;
          if (value.firebaseId == null || value.firebaseId == undefined) delete value.firebaseId;
          _db.child(id).update(value, function(result) {
            value.firebaseId = redId;
            cb(result);
           });
        }
      },
      valueSet: function(id, value, cb) {
        if (firebaseUser == null) {
          alert('You are not logged in. Reload and try logging in.');
        }
        else {
          value.userId = firebaseUser.id;
          var refId = value.firebaseId;
          if (value.firebaseId == null || value.firebaseId == undefined) delete value.firebaseId;
          _db.child(id).set(value, function(result) {
            value.firebaseId = refId;
            cb(result);
          });
        }
      },
      remove: function(id, cb) {
        _db.remove(id, cb);
      },
      add: function(parentId, setId, value, cb) {
        if (firebaseUser == null) {
          alert('You are not logged in. Reload and try logging in.');
        }
        else {
          value.userId = firebaseUser.id;
          if (setId !== null) {
            if (parentId !== null && parentId !== '' ) {
              _db.child(parentId + '/' + setId).set(value, cb);
            }
          }
          else {
            var ref = _db.child(parentId).push(value);
            cb(ref.name());
          }
        }
      }
    };
    // Public API here
    return {
      autoLogin: function(cb) {
        _methods.autoLogin(cb);
      },
      login: function(type) {
        _methods.login(type);
      },
      logout: function(cb) {
        _methods.logout(cb);
      },
      getUser: function(cb) {
        _methods.getUser(cb);
      },
      authorize: function(token, cb) {
        _methods.authorize(token, cb);
      },
      // streaming is bool
      get: function(id, cb) {
          _methods.valueOnce(id, cb);
        },
      getStream: function(id, cb) {
          _methods.valueOn(id, cb);
        },
      // updating is bool
      set: function(id, value, cb) {
          _methods.valueSet(id, value, cb);
        },
      update: function(id, value, cb) {
          _methods.valueUpdate(id, value, cb);
        },
      remove: function(id, cb) {
          _methods.remove(id, cb);
        },
      // setId is optional string 
      add: function(parentId, setId, value, cb) {
          _methods.add(parentId, setId, value, cb);
        },
      checkLogin: function() {
        _methods.checkLogin();
      }
    };
  });
