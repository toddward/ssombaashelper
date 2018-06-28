const bodyParser = require('body-parser');
const fh = require('fh-mbaas-api');
const logger = require('fhlog');

var log = logger.getLogger('Logging', {
  level: logger.LEVELS.DBG
});

function doLogin (req, res, next) {
  // We should do some checking to ensure the object contains the right information.
  if (req.body) {
    // We're checking the authentication object
    // {"employee_id":"","password":"","group":"","auth_method":"3"}
    if (!req.body.employee_id) {
      log.i('Rejecting auth request, employee_id not present.');
      return res.status(400).json({ 'status': 'error', 'msg': 'employee_id not present.' });
    }
    if (!req.body.password) {
      log.i('Rejecting auth request, password not present');
      return res.status(400).json({'status': 'error', 'msg': 'password not present.'});
    }
    // If auth_method is not supplied or not set correctly, ensure that it's set.
    if (!req.body.auth_method && req.body.auth_method !== 3) {
      req.body.auth_method = 3;
    }
  } else {
    log.e('Rejecting auth request, body not present.');
    return res.status(400).json({'status': 'error', 'msg': 'request body not present'});
  }

  // Temp GUID
  fh.service({
    'guid': process.env.SSOGUID,
    'path': '/api/v1/authorization/login',
    'params': req.body,
    'method': 'POST'
  }, (err, body, response) => {
    if (err || response.statusCode !== 200) {
      log.e('The was an issue calling SSO MBaaS. Error: %s.', err);
      return res.status(response.statusCode).json(response);
    } else {
      log.d('Successful return from SSO. Data: ', body);
      return res.status(200).json(body);
    }
  });
}

var router = module.exports = require('express').Router();
router.use(bodyParser());
router.post('/', doLogin);
