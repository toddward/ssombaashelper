// var bodyParser = require('body-parser');
const fh = require('fh-mbaas-api');
const logger = require('fhlog');

var log = logger.getLogger('Logging', {
  level: logger.LEVELS.DBG
});

function doVerify (req, callback) {
  // Validate that we've receiveed the headers and correct authorization token.
  var token = req.headers['authorization'];
  var headers = { authorization: token };

  if (token) {
    log.d('Verification of token taking place.  Token: %s.', token);
    fh.service({
      'guid': '57eey5adndipnpqvb3z6i5cm',
      'path': '/api/v1/authorization/verify',
      'headers': headers,
      'method': 'POST'
    }, callback);
  } else {
    log.d('No token supplied');
    return callback(new Error('no token supplied'));
  }
}

exports.verify = doVerify;
