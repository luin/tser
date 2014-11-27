var Proxy = require('harmony-proxy');
var methods = require('methods');
var rp = require('request-promise');

var Collection = module.exports = function(parent, name, options) {
  var collection = function(id) {
    var resource = Object.create(collection);
    Object.defineProperty(resource, '__id', { value: id });
    return new Proxy(resource, {
      get: function(target, name) {
        if (name in target) {
          return target[name];
        }
        return Collection(resource, name, options);
      }
    });
  };

  Object.defineProperty(collection, '__name', { value: name });
  Object.defineProperty(collection, '__parent', { value: parent });

  methods.forEach(function(method) {
    collection[method] = function(query, body, header) {
      if (!body && !header) {
        if (options.preferQuery.indexOf(method) === -1) {
          body = query;
          query = null;
        }
      }
      var url = '';
      var c = collection;
      while (c) {
        if (typeof c.__id !== 'undefined' && c.__id !== null) {
          url = '/' + c.__id.toString() + url;
        }
        url = '/' + c.__name + url;
        c = c.__parent;
      }
      var req = {
        method: method,
        url: url
      };
      if (typeof body === 'object' && body !== null) {
        req.json = body;
      } else if (typeof body === 'string' || Buffer.isBuffer(body)) {
        req.body = body;
      }
      return rp(req);
    };
  });
  return collection;
};
