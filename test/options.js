var proxyquire = require('proxyquire');

var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = require('chai').expect;

var stubFunc = function(options, callback) {
  callback(null, null, options);
};
stubFunc['@global'] = true;
var tser = proxyquire('..', { 'request': stubFunc });

describe('options', function() {
  before(function() {
    this.url = 'http://domain.com';
    this.api = tser(this.url, {
      defaults: {
        url: '123',
        key1: 'value1',
        key2: 'value2'
      }
    });
  });

  it('should support defaults', function() {
    return expect(this.api.users.get()).to.become({
      method: 'get',
      url: this.url + '/users',
      key1: 'value1',
      key2: 'value2'
    });
  });

  it('should use settings to override defaults', function() {
    return expect(this.api.users.get(null, null, {
      key1: 'new',
      key3: 'value3'
    })).to.become({
      method: 'get',
      url: this.url + '/users',
      key1: 'new',
      key2: 'value2',
      key3: 'value3'
    });
  });

  it('should use settings to override method & url', function() {
    return expect(this.api.users.get(null, null, {
      method: 'method',
      url: 'url'
    })).to.become({
      method: 'method',
      url: 'url',
      key1: 'value1',
      key2: 'value2'
    });
  });
});
