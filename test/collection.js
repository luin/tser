var proxyquire = require('proxyquire');

var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = require('chai').expect;

var stubFunc = function(options, callback) {
  callback(null, null, options);
};
stubFunc['@global'] = true;
var tser = proxyquire('..', { 'request': stubFunc });

describe('collection', function() {
  before(function() {
    this.url = 'http://domain.com';
    this.api = tser(this.url);
  });

  it('should support get', function() {
    return expect(this.api.users.get()).to.become({
      method: 'get',
      url: this.url + '/users'
    });
  });

  describe('query', function() {
    it('should support object query', function() {
      return expect(this.api.users.get({
        age: 17
      })).to.become({
        method: 'get',
        url: this.url + '/users?age=17'
      });
    });

    it('should support string query with "?"', function() {
      return expect(this.api.users.get('?age=17')).to.become({
        method: 'get',
        url: this.url + '/users?age=17'
      });
    });

    it('should support string query without "?"', function() {
      return expect(this.api.users.get('age=17')).to.become({
        method: 'get',
        url: this.url + '/users?age=17'
      });
    });
  });

  it('should support post', function() {
    return expect(this.api.users.post()).to.become({
      method: 'post',
      url: this.url + '/users'
    });
  });

  describe('body', function() {
    it('should support object body', function() {
      return expect(this.api.users.post({
        name: 'bob'
      })).to.become({
        method: 'post',
        url: this.url + '/users',
        json: {
          name: 'bob'
        }
      });
    });

    it('should support string body', function() {
      return expect(this.api.users.post('name=bob')).to.become({
        method: 'post',
        url: this.url + '/users',
        body: 'name=bob'
      });
    });
  });

  describe('settings', function() {
    it('should support settings', function() {
      return expect(this.api.users.get(null, null, { key: 'value' })).to.become({
        method: 'get',
        url: this.url + '/users',
        key: 'value'
      });
    });
  });

  describe('nesting', function() {
    it('should support get', function() {
      return expect(this.api.users(17).projects.get({ type: 'task' })).to.become({
        method: 'get',
        url: this.url + '/users/17/projects?type=task'
      });
    });

    it('should support post', function() {
      return expect(this.api.users(17).projects.post({ type: 'task' })).to.become({
        method: 'post',
        url: this.url + '/users/17/projects',
        json: { type: 'task' }
      });
    });
  });
});
