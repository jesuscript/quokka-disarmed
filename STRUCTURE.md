#  Project Structure

##Hierarchy

STRUCTURE.md -- this file  
STANDARDS.md -- case standards for variable, function naming, etc 
README.md -- to make github happy  


* /.meteor -- meteor engine

* /client 
 * /lib -- client-side js libraries
 * /lib/lib -- jquery libraries
 * /templates -- js for each one of the handlebar templates
 * /templates/lib -- shared js between templates
 * auth.js -- client-side authentication framework
 * bet_slider.js -- the lucky slider client side code
 * main.js -- 'playpen' area, should be blank most of the time

* /css -- all css goes there
 * /lib -- shared css functionnality
 * /jqrangeslider -- the lucky slider theme
 * application.css -- application-wide css file

* /db
 * collections.js -- collections publishing and security
 * helpers.js -- helpers for db-related functions

* /layout -- HTML files, one per handlebar block

* /lib -- shared client & server third party .js libraries

* /packages -- mandatory location of npm dependencies
 * /bitcoin -- npm-bitcoin pulled from npm repo by meteor

* /public -- web assets that end up in static/cacheable
 * /img -- images

* /server -- server only code
 * /methods -- server methods and their specific functions, callable by the client side
 * auth.js -- user creation and validation
 * main.js -- server startup: page redirection, io connection strings, etc (executed once on initial page load)
 * scheduler.js -- calls to Meteor.setInterval() - NOT IMPLEMENTED YET



