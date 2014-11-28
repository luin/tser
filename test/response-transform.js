var proxyquire = require('proxyquire');

var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = require('chai').expect;

var stubFunc = function(options, callback) {
  if (options.url.indexOf('reject') === -1) {
    callback(null, options, { body: true });
  } else {
    callback({ err: 'err' }, options, { body: true });
  }
};
stubFunc['@global'] = true;
var tser = proxyquire('..', { 'request': stubFunc });
var express = require('express');

describe('response transform', function() {
  before(function() {
    var app = express();
    app.get('/status/resolve', function(req, res) { res.json({ key: 'value' }); });
    app.get('/status/reject', function(req, res) { res.status(400).json({ key: 'value' }); });
    this.server = app.listen(0);
    this.api = tser(app, {
      transform: {}
    });
  });

  after(function() {
    this.server.close();
  });

  it('should transform the response', function() {
    this.api.$options.transform.response = function(err, res, body) {
      return body;
    };
    return expect(this.api.status('resolve').get()).to.become({ body: true });
  });

  it('should reject the error', function() {
    this.api.$options.transform.response = function(err, res, body) {
      if (err) {
        throw new tser.ResponseError({
          wrapper: true,
          err: err
        });
      }
      return body;
    };
    return this.api.status('reject').get().catch(function(err) {
      expect(err).to.eql({ wrapper: true, err: { err: 'err' } });
    });
  });
});
