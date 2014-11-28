Tser
====

A general node.js client for RESTful API

[![Build Status](https://travis-ci.org/luin/tser.png?branch=master)](https://travis-ci.org/luin/tser)

Install
-------

    $ npm install tser

Usage
-----

Tser is the reversed 'Rest' and it can turn any RESTful API into a node.js client.

```javascript
var tser = require('tser');

var api = tser('http://demo7394653.mockable.io/');

// GET http://domain.com/api/users/12/projects?status=active
api.users(12).projects.get({ status: 'active' }).then(function(res) {
  console.log(res);
});
```

```javascript
var tser = require('tser');

var api = tser('http://demo7394653.mockable.io/');

// POST http://demo7394653.mockable.io/api/users
//  with json body { name: 'Bob' }
api.users.post({ name: 'Bob' }).then(function(res) {
  console.log(res);
});
```

```javascript
var tser = require('tser');

var api = tser('http://demo7394653.mockable.io/', {
  transform: {
    request: function(options) {
      if (this.auth) {
        options.auth = this.auth;
      }
      return options;
    }
  }
});

// GET http://demo7394653.mockable.io/api/users/me
api.users('me').get().catch(function(err) {
  // 401
});

api.$set('auth', {
  user: 'abc',
  pass: 'pass'
});

// GET http://demo7394653.mockable.io/api/users/me
api.users('me').get().then(function(me) {
    console.log(me);
});
```
