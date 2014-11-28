// Bring from request-promise module
// Load Request freshly - so that users can require an unaltered request instance!
var request = (function () {
  function clearCache() {
    _(require.cache).keys().forEach(function (key) {
      delete require.cache[key];
    });
  }

  var temp = _.assign({}, require.cache);
  clearCache();

  var freshRequest = require('request');

  clearCache();
  _.assign(require.cache, temp);

  return freshRequest;

})();
