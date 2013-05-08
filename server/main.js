// set up SMTP gateway
process.env.MAIL_URL = 'smtp://johan.daugh%40gmail.com:nueFnRWLFIRZxwx30WxljA@smtp.mandrillapp.com:587';

// triggers page redirect on load, guaranteeing unique token
var connect = Npm.require('connect');

__meteor_bootstrap__.app.use(connect.query()).use(function(req, res, next) {
  // check if the url path is a valid sha256 hash 
  if (req.url.length == 65 && req.url.substr(1,64).search(/[a-fA-F0-9]{64}$/) == 0) {
  next();
  } else {
  // not valid, generate and redirect
  var crypto = Npm.require('crypto');
  crypto.randomBytes(512, function(ex, buf) {
    if (ex) throw ex;
    var hash = crypto.createHash('sha256').update(buf).digest("hex");
    res.writeHead(301, {'Location': req.headers['x-forwarded-proto'] + '://' + req.headers.host + '/' + hash});
    res.end();
  });
  }
});


// creates btcd connection object
// TODO: currently pointing at testnet connection details
btcdClient = new BITCOIN.Client({ //none of this is accessible from outside the local machine
  host: 'localhost',
  port: 18332, 
  user: 'bitcoinrpc',
  pass: 'pass'
});




