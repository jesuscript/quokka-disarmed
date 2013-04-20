var connect = Npm.require('connect');
__meteor_bootstrap__.app
  .use(connect.query())
  .use(function(req, res, next) {
    // check if the url path is a valid sha256 hash 
    if (req.url.length == 65 && req.url.substr(1,64).search(/[a-fA-F0-9]{64}$/) == 0) {
      // console.log('valid hash '+ req.url.substr(1,64) +  'found in URL, moving on');
      // if btc account exists
      //var account = Accounts.find({hash: req.url.substr(1,64)}, {fields: {address: 1}}); // TODO: is this async?
      // else (doens't exist)
        // generate
      next();
    } else {
      console.log('invalid URL, generating....');
      // not valid, generate and redirect
      var crypto = Npm.require('crypto');
      crypto.randomBytes(512, function(ex, buf) {
        if (ex) throw ex;
        var hash = crypto.createHash('sha256').update(buf).digest("hex");
        console.log(req.headers.host + '/' + hash);
        res.writeHead(301, {'Location': req.headers['x-forwarded-proto'] + '://' + req.headers.host + '/' + hash});
        res.end();
      });
    }
  });
