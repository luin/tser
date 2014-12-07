var Collection = require('./lib/collection');
var _ = require('lodash');
var http = require('http');
var https = require('https');

exports = module.exports = function(url, options) {
  options = _.defaults(options || {}, {
    values: {},
    preferQuery: ['get', 'head', 'delete', 'options']
  });

  if (typeof url === 'object' && url !== null && typeof url.callback === 'function') {
    url = url.callback();
  }
  if (typeof url === 'function') {
    var app = http.createServer(url);
    var addr = app.address();
    if (!addr) {
      app.listen(0);
    }
    var port = app.address().port;
    var protocol = app instanceof https.Server ? 'https' : 'http';
    url = protocol + '://127.0.0.1:' + port;
  }
  options.url = url;
  var base = Collection(null, null, null, options);
  base.$set = function(key, value) {
    if (arguments.length === 2) {
      var obj = {};
      obj[key] = value;
      return base.$set(obj);
    }
    Object.keys(key).forEach(function(k) {
      options.values[k] = key[k];
    });
    return base;
  };
  base.$get = function(key) {
    return options[key];
  };
  base.$options = options;
  return base;
};

exports.ResponseError = require('./lib/response-error');
