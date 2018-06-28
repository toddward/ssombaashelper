var unless = require('express-unless');
var verify = require('./verify').verify;

function TokenValidation(req, res, next) {
  function onServiceRes(err, body, serviceRes) {
    if (serviceRes.statusCode === 200) {
      // Since we have a 200, allow the request to pass.
      next();
    } else {
      return res.status(401).send('invalid token');
    }
  }

  verify(req, onServiceRes);
}

TokenValidation.unless = unless;

module.exports = TokenValidation.unless({
  path: ['/mbaas/db']
});

module.exports.unless = unless;