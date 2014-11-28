var proxyquire = require('proxyquire');

var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = require('chai').expect;

var stubFunc = function(options, callback) {
  callback(null, null, options);
};
stubFunc['@global'] = true;
var tser = proxyquire('..', { 'request': stubFunc });

describe('resource', function() {
  before(function() {
    this.url = 'http://domain.com';
    this.api = tser(this.url);
  });

  it('should support get', function() {
    return expect(this.api.users(12).get()).to.become({
      method: 'get',
      url: this.url + '/users/12'
    });
  });

  it('should support nest collection', function() {
    return expect(this.api.users(12).projects.post()).to.become({
      method: 'post',
      url: this.url + '/users/12/projects'
    });
  });
});
