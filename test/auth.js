var proxyquire = require('proxyquire');

var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = require('chai').expect;

var stubFunc = function(options, callback) {
  callback(null, { statusCode: 200 }, options);
};
stubFunc['@global'] = true;
var tser = proxyquire('..', { 'request': stubFunc });

describe('auth', function() {
  before(function() {
    this.url = 'http://domain.com';
    this.api = tser(this.url);
  });

  it('should send auth info', function() {
    return expect(this.api.$auth('user', 'pass').users.get()).to.become({
      method: 'get',
      auth: {
        user: 'user',
        pass: 'pass'
      },
      url: 'http://domain.com/users'
    });
  });
});
