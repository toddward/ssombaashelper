var request = require('request-promise');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var service = require('fh-mbaas-api').service;

function doLogin (req, res, next) {
  // We should do some checking to ensure the object contains the right information.
  if (req.body) {
    // We're checking the authentication object
    // {"employee_id":"","password":"","group":"","auth_method":"3"}
    if (!req.body.employee_id) {
      return res.status(400).json({'status': 'error', 'msg': 'employee_id not present.'});
    }
    if (!req.body.password) {
      return res.status(400).json({'status': 'error', 'msg': 'password not present.'});
    }
    // If auth_method is not supplied or not set correctly, ensure that it's set.
    if (!req.body.auth_method && req.body.auth_method !== 3) {
      req.body.auth_method = 3;
    }
  } else {
    return res.status(400).json({'status': 'error', 'msg': 'request body not present'});
  }

  fh.service({
    "guid": "<<need guid>>",
    "path": "/api/v1/authorization/login",
    "method": "POST"
  }, (err, body, response) => {
    if (err || response.statusCode != 200) {
      logger.log('error', 'There was an issue calling SSO MBaaS.  Error: ', err);
      return res.status(response.statusCode).json(response);
    } else {
      logger.log('info', 'Successful return from Infor MBaaS. Data: ', body);
      return res.status(200).json(body);
    }
  });
}

var router = module.exports = require('express').Router();
router.use(bodyParser());
router.post('/', doLogin);
