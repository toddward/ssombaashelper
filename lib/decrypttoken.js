const bodyParser = require('body-parser');
const fh = require('fh-mbaas-api');
const logger = require('fhlog');

var log = logger.getLogger('Logging', {
  level: logger.LEVELS.DBG
});

function doDecryptToken (req, res, next) {
  var token = req.body.token;
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
        return res.status(response.statusCode).json(response);
      } else {
        log.d('Successful Token Renewal %s', body);
        return res.status(200).json(body);
      }
    });
  } else {
    log.d('No token supplied');
    return res.status(400).json({
      status: 'error',
      msg: 'no token supplied for renewal'
    });
  }
}

var router = module.exports = require('express').Router();
router.use(bodyParser());
router.post('/', doDecryptToken);
