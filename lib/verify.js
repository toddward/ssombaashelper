var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var service = require('fh-mbaas-api').service;

function doVerify(req, res, next) {
  // Validate that we've receiveed the headers and correct authorization token.
  var token = req.headers['authorization'];
  var headers = { authorization: token };

  if (token) {
    fh.service({
      "guid": "<<need guid>>",
      "path": "/api/v1/authorization/verify",
      "headers": headers,
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
  } else {
    return res.status(400).json({
      status: "error",
      msg: "No Token Supplied for Verification."
    });
  }
}

var router = module.exports = require('express').Router();
router.use(bodyParser());
router.post('/', doVerify);
