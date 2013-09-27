'use strict';

describe('Service: Story', function () {

  // load the service's module
  beforeEach(module('appApp'));

  // instantiate service
  var Story;
  beforeEach(inject(function (_Story_) {
    Story = _Story_;
  }));

  it('should do something', function () {
    expect(!!Story).toBe(true);
  });

});
