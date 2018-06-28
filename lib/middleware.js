const unless = require('express-unless');
const verify = require('./verify').verify;
const log = require('fhlog');

function TokenValidation(req, res, next) {
  function onServiceRes(err, body, serviceRes) {
    if (serviceRes.statusCode === 200) {
      log.d('Verification of token valid, cleared to proceed.');
      // Since we have a 200, allow the request to pass.
      next();
    } else {
      log.e('Error with token validation.  Invalid Token supplied.  Error: %s.', err);
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