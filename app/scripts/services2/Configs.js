'use strict';

angular.module('rtaApp')
  .factory('Configs', function () {
    // Service logic
    // ...
    var _configs = {
      firebase: {
        dbName: 'powwow',
        dbRoot: 'rta',
      },
      restServer: {
        url: '66.228.48.118',
        path: '/rest',
        port: '8085'
      }
    };
    NProgress.configure({ speed: 100, trickleRate: 0.1, trickleSpeed: 100 });
    
    // Public API here
    return _configs;
  });
