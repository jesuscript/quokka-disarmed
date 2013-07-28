// this works by monitoring users subscribing to the connectionsMonitor collection, which is guaranteed to happen
// TODO: make it work with multiple windows support to prevent double logging count. Also would need to differentiate between IPs
// Meteor.publish('connectionsMonitor', function() {
 
//   if (Collections.Connections.find({}).count() === 0) Collections.Connections.insert( { usersLoggedIn: 0, usersObserving: 0 } );

//   // each time the publish function is called, the events rebind, so we need to limit that
//   if(this._session.socket && this._session.socket._events.data.length === 1) {
//     userId = this.userId;
//     if (userId) { 
//       Collections.Connections.update({}, {$inc: {usersLoggedIn: 1}});
//     } else { 
//       Collections.Connections.update({}, {$inc: {usersObserving: 1}});
//     }

//     this._session.socket.on('data', Meteor.bindEnvironment(function(data) { // Throws on dev, sometimes, likely to be when the localhost meteor js monitoring script do funny things with sockets
//       var method = JSON.parse(data).method;

//       if (method === 'login' || method === 'createUser') {
//         Collections.Connections.update({}, {$inc: {usersObserving: -1}});
//         Collections.Connections.update({}, {$inc: {usersLoggedIn: 1}});
//       } else if (method === 'logout') {
//         Collections.Connections.update({}, {$inc: {usersLoggedIn: -1}});
//         Collections.Connections.update({}, {$inc: {usersObserving: 1}});
//       }
//     }, function(e) {
//       console.error(e);
//     }));

//     this._session.socket.on('close', Meteor.bindEnvironment(function() {
//       if(userId === null || userId === undefined) {
//         Collections.Connections.update({}, {$inc: {usersObserving: -1}});
//       } else {
//         Collections.Connections.update({}, {$inc: {usersLoggedIn: -1}});
//       }
//     }, function(e) {
//       console.error('close error', e);
//     }));
//   }
// });
