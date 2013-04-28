#TODO: need to finish this
#  Folder Structure

##Hierarchy

STRUCTURE.md -- this file  
STANDARDS.md -- case standards for variable, function naming, etc 
README.md -- to make github happy  


* /.meteor -- meteor engine

* /client 
 * /stylesheets -- page.css for global layout, app.css for everything else
 * /views -- broken down by template, with page.html/page.js as the topmost file
 * app.js -- the main code base
 * methods.js -- client methods
 * scheduler.js -- calls to Meteor.setInterval()
 * startup.js -- the Meteor.startup() block

* /common
 * collections.js -- Collections declarations

* /lib -- Third party libraries
 * logger.js -- Observatory initialization

* /public -- web assets

* /server -- 
 * methods.js -- server side methods called using Meteor.call()
 * publishing.js -- Collection publishing and security
 * scheduler.js -- calls to Meteor.setInterval()
 * startup.js -- the Meteor.startup() block


