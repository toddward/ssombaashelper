const unless = require('express-unless');
const verify = require('./verify').verify;
const logger = require('fhlog');

var log = logger.getLogger('Logging', {
  level: logger.LEVELS.DBG
});

function TokenValidation (req, res, next) {
  function onServiceRes (err, body, serviceRes) {
    if (err) {
      return res.status(401).json({
        status: 'error',
        msg: err
      });
    } else if (serviceRes.statusCode === 200) {
      log.d('Verification of token valid, cleared to proceed.');
      // Since we have a 200, allow the request to pass.
      next();
    } else {
      log.e('Error with token validation.  Invalid Token supplied.  Error: %s.', err);
      return res.status(401).json({
        status: 'error',
        msg: 'Error with token validation.  Invalid Token supplied.'
      });
    }
  }
  if (req.body && req.body.fn === 'syncRecords') {
    next();
  } else {
    verify(req, onServiceRes);
  }
}

TokenValidation.unless = unless;

module.exports = TokenValidation.unless({
  path: ['/mbaas/db']
});

module.exports.unless = unless;
