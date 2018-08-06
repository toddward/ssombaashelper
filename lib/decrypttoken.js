const bodyParser = require('body-parser');
const fh = require('fh-mbaas-api');
const logger = require('fhlog');

var log = logger.getLogger('Logging', {
  level: logger.LEVELS.DBG
});

function doDecryptToken (token, cb) {
  var headers = { authorization: token };

  if (token) {
    log.d('Decryption of token taking place.  Token: %s.', token);

    fh.service({
      'guid': process.env.SSOGUID,
      'path': '/api/v1/authorization/decrypttoken',
      'headers': headers,
      'method': 'POST'
    }, (err, body, response) => {
      if (err) {
        log.e('The was an issue calling SSO MBaaS. Error: %s.', err);
        return cb('There was an calling SSO MBaaS. Error: %s.', err);
      } else {
        log.d('Successful Token Renewal %s', body);
        return cb(null, body);
      }
    });
  } else {
    log.d('No token supplied');
    return cb('no token supplied');
  }
}

module.exports = doDecryptToken;
