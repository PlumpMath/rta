'use strict';

describe('Controller: EditStoryCtrl', function () {

  // load the controller's module
  beforeEach(module('angularAppsApp'));

  var EditStoryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditStoryCtrl = $controller('EditStoryCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
