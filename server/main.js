var connect = Npm.require('connect');
var fibers = Npm.require('fibers');

__meteor_bootstrap__.app.use(connect.query()).use(function(req, res, next) {
    // check if the url path is a valid sha256 hash 
    if (req.url.search(/^\/[a-fA-F0-9]{64}$/) == 0) {
        // console.log('valid hash '+ req.url.substr(1,64) +  'found in URL, moving on');
        // if btc account exists
        
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
            res.writeHead(301, {'Location': hash});
            res.end();
        });
    }
});

