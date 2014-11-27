var Collection = require('./lib/collection');

function defaults(def, override) {
  var obj = {};
  for (var key in def) {
    if (def.hasOwnProperty(key)) {
      obj = override[key] || def[key];
    }
  }
}

module.exports = function(url, options) {
  options = defaults({
    preferQuery: ['get', 'head', 'delete', 'options']
  }, options);

  if (typeof url !== 'string') {
    var addr = url.address();
    if (!addr) {
      url.listen(0);
    }
    var port = url.address().port;
    var protocol = url instanceof https.Server ? 'https' : 'http';
    url = protocol + '://127.0.0.1:' + port + path;
  }
  return Collection(null, null, options);
};
