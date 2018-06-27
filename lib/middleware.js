var unless = require('express-unless');
var log = require('fhlog');
var verify = require('./verify').verify;

function TokenValidation(req, res, next) {
  function onServiceRes(err, body, serviceRes) {
    console.log('-->' + JSON.stringify(err));
    console.log('-->' + JSON.stringify(body));
    console.log('-->'+JSON.stringify(serviceRes));
  }

  verify(req, onServiceRes);
}

TokenValidation.unless = unless;

module.exports = TokenValidation.unless({
  path: ['/mbaas/db']
});

module.exports.unless = unless;