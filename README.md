Tser
====

A general node.js client for RESTful API

[![Build Status](https://travis-ci.org/luin/tser.png?branch=master)](https://travis-ci.org/luin/tser)

Install
-------

    $ npm install tser

Usage
-----

```javascript
var tser = require('tser');

var api = tser('http://demo7394653.mockable.io/');

// GET http://domain.com/api/users/12/projects?status=active
api.users(12).projects.get({ status: 'active' }).then(function(res) {
  console.log(res);
});
```
