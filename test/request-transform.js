var proxyquire = require('proxyquire');

var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = require('chai').expect;

var stubFunc = function(options, callback) {
  callback(null, { statusCode: 200 }, options);
};
stubFunc['@global'] = true;
var tser = proxyquire('..', { 'request': stubFunc });

describe('request transform', function() {
  before(function() {
    this.url = 'http://domain.com';
    this.api = tser(this.url, {
      defaults: {
        url: '123',
        key1: 'value1',
        key2: 'value2'
      },
      transform: {}
    });
  });

  it('should receive all settings', function() {
    var isTransformFuncCalled = false;
    var _this = this;
    this.api.$options.transform.request = function(options) {
      isTransformFuncCalled = true;
      expect(options).to.eql({
        method: 'get',
        url: _this.url + '/users',
        key1: 'value1',
        key2: 'value2'
      });
      return options;
    };
    return this.api.users.get().then(function() {
      expect(isTransformFuncCalled).to.eql(true);
    });
  });

  it('should be able to change settings', function() {
    this.api.$options.transform.request = function(options) {
      return {
        status: 'transformed'
      };
    };
    return expect(this.api.users.get()).to.become({
      status: 'transformed'
    });
  });

  it('support promise', function() {
    this.api.$options.transform.request = function(options) {
      var promise = new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve({ status: 'transformed' });
        }, 0);
      });
      return promise;
    };
    return this.api.users.get().then(function(res) {
      expect(res).to.eql({ status: 'transformed' });
    });
  });

  it('should throw error when transform return nothing', function() {
    this.api.$options.transform.request = function() {};
    expect(function() {
      this.api.users.get();
    }).to.throw();
  });

  it('should be able to access values via `this`', function() {
    this.api.$options.transform.request = function(options) {
      if (this.auth) {
        options.auth = this.auth;
      }
      return options;
    };
    var self = this;
    return this.api.users(12).get().then(function(res) {
      expect(res).to.eql({
        method: 'get',
        url: self.url + '/users/12',
        key1: 'value1',
        key2: 'value2'
      });
      self.api.$set('auth', {
        username: 'user',
        password: 'password'
      });
      return expect(self.api.users(12).get()).to.become({
        method: 'get',
        url: self.url + '/users/12',
        auth: {
          username: 'user',
          password: 'password'
        },
        key1: 'value1',
        key2: 'value2'
      });
    });
  });
});
