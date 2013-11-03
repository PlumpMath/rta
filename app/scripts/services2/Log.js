'use strict';

angular.module('jpAppApp')
  .factory('log', function () {
    // Service logic
    // ...

    var _log = function(msg) {
    };

    // Public API here
    return function (msg) {
      console.log(msg, __prevLine);
      console.log(msg, __function);
    };
    
  });

