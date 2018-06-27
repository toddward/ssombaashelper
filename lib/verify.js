//var bodyParser = require('body-parser');
var fh = require('fh-mbaas-api');

function doVerify(req, callback) {
  // Validate that we've receiveed the headers and correct authorization token.
  var token = req.headers['authorization'];
  var headers = { authorization: token };

  if (token) {
    fh.service({
      "guid": "57eey5adndipnpqvb3z6i5cm",
      "path": "/api/v1/authorization/verify",
      "headers": headers,
      "method": "POST"
    }, callback);
  } else {
    return callback('no token supplied');
  }
}

exports.verify = doVerify;
