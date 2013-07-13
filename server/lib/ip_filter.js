// THIS IS PROBABLY BROKEN IN THIS FOLDER - needs to load first
// Please keep in codebase, will be useful if we do eventually switch to a CDN

// if (process.env.NODE_ENV != 'dev') { 
//   // have to do this as ipfiltering when using a CDN requires an nginx recompile
//   var connect = Npm.require('connect');

//   __meteor_bootstrap__.app.use(connect.query()).use(function(req, res, next) {
//     if (req.headers['incap-client-ip'] != '80.195.186.226') {
//       res.writeHead(301, {'Location': process.env.PROTO + '://' + req.headers.host + '/50x.html?redir=true'});
//       res.end();
//     } else {
//       next();
//     }
//   });
// }

