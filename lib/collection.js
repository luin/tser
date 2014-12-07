var Proxy = require('harmony-proxy');
var methods = require('methods');
var rp = require('request-promise');
var querystring = require('querystring');
var _ = require('lodash');
var ResponseError = require('./response-error');
var request = require('request');

var Collection = module.exports = function(parent, name, id, options) {
  if (arguments.length === 3) {
    options = id;
    id = undefined;
  }
  var collection;
  if (typeof id !== 'undefined') {
    var obj = {};
    Object.defineProperty(obj, '__id', { value: id });
    collection = new Proxy(obj, {
      get: function(target, name) {
        if (name in target) {
          return target[name];
        }
        if (['constructor', 'inspect'].indexOf(name) === -1) {
          return Collection(collection, name, options);
        }
      }
    });
  } else {
    collection = function(id) {
      return Collection(parent, name, id, options);
    };
  }

  Object.defineProperty(collection, '__name', { value: name });
  Object.defineProperty(collection, '__parent', { value: parent });

  methods.forEach(function(method) {
    collection[method] = function(query, body, settings) {
      if (!body && !settings) {
        if (options.preferQuery.indexOf(method) === -1) {
          body = query;
          query = null;
        }
      }
      var url = '';
      var c = collection;
      while (c && c.__name) {
        if (typeof c.__id !== 'undefined' && c.__id !== null) {
          url = '/' + c.__id.toString() + url;
        }
        url = '/' + c.__name + url;
        c = c.__parent;
      }
      if (query) {
        if (typeof query === 'string') {
          if (query[0] !== '?') {
            query = '?' + query;
          }
          url += query;
        } else {
          url += '?' + querystring.stringify(query);
        }
      }
      var req = options.defaults ? _.cloneDeep(options.defaults) : {};
      req.method = method;
      req.url = options.url + url;
      if (typeof body === 'object' && body !== null) {
        req.json = body;
      } else if (typeof body === 'string' || Buffer.isBuffer(body)) {
        req.body = body;
      }
      if (settings) {
        req = _.assign(req, settings);
      }

      var promise;
      if (options.transform && options.transform.request) {
        req = options.transform.request.call(options.values, req);
        if (typeof req !== 'object' || req === null) {
          throw new Error('`transform` should return an object');
        }
        if (typeof req.then === 'function') {
          promise = req;
        }
      }
      if (!promise) {
        promise = Promise.resolve(req);
      }
      return promise.then(function(req) {
        return new Promise(function(resolve, reject) {
          request(req, function(err, res, body) {
            if (options.transform && options.transform.response) {
              try {
                var result = options.transform.response(err, res, body);
                resolve(result);
              } catch (e) {
                if (e instanceof ResponseError) {
                  reject(e.reject);
                } else {
                  throw e;
                }
              }
              return;
            }
            if (err) {
              reject(err);
            } else {
              var code = res.statusCode.toString();
              if (code && code[0] === '2') {
                resolve(body);
              } else {
                reject(res);
              }
            }
          });
        });
      });
    };
  });
  return collection;
};
