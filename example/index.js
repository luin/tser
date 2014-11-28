var tser = require('..');

var api = tser('http://demo7394653.mockable.io/', {
  transform: {
    request: function(options) {
      console.log(arguments.length, arguments);
      return arguments[0];
    },
    response: function(err, response, body) {
      if (err) {
        throw tser.ResponseError(res);
      }
      return body;
    }
  }
});

// GET http://domain.com/api/users/12/projects?status=active
api.users(12).projects.get({ status: 'active' }).then(function(projects) {
  // project list
  console.log(projects);
});

// GET http://domain.com/api/users/13/projects?status=active
api.users(13).projects.get({ status: 'active' }).then(function(projects) {
  // project list
  // console.log(projects);
}).catch(function(err) {
  // console.log(err);
});
