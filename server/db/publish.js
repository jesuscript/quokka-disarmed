AddressPool = new Meteor.Collection('addressPool'); // server only

Meteor.publish('flags', function(){
  return Collections.Flags.find({});
});

Meteor.publish('news', function(){
  return Collections.News.find({}, {sort: {timestamp: -1}, limit: 10});
});

Meteor.publish('games', function(){
  return Collections.Games.find({},{sort: {createdAt: -1}, limit: 100});
});

Meteor.publish('bets', function(){ //updated to publish only for the current game
  return Collections.Bets.find({gameId: DB.currentGame()._id});
});

Meteor.publish('userData', function(){  // built-in meteor collection
  return Meteor.users.find({_id: this.userId}, 
                           {fields: { 
                             'balance': 1,
                             'depositAddress': 1
                           }});
});

// the user shouldn't have the right to modify anything within their user profiles
Meteor.users.deny({update: function () { return true; }});

Meteor.publish('users', function(){ // TODO - this publishes the entire list of usernames to the client, could grow to gigs!
  return Meteor.users.find({}, {
    fields: {
      username: 1
    }
  });
});

Meteor.publish('payouts', function(){
  return Collections.Payouts.find({},{sort: {timestamp: -1}, limit: 10});
});

Meteor.publish('allTimeStats', function(){
  return Collections.AllTimeStats.find({});
});



Meteor.publish('connections', function(){
  return Collections.Connections.find({});
});

// this works by monitoring users subscribing to the connectionsMonitor collection, which is guaranteed to happen
// TODO: make it work with multiple windows support to prevent double logging count. Also would need to differentiate between IPs
Meteor.publish('connectionsMonitor', function() {
 
  if (Collections.Connections.find({}).count() === 0) Collections.Connections.insert( { usersLoggedIn: 0, usersObserving: 0 } );

  // each time the publish function is called, the events rebind, so we need to limit that
  if(this._session.socket && this._session.socket._events.data.length === 1) {
    userId = this.userId;
    if (userId) { 
      Collections.Connections.update({}, {$inc: {usersLoggedIn: 1}});
    } else { 
      Collections.Connections.update({}, {$inc: {usersObserving: 1}});
    }

    this._session.socket.on('data', Meteor.bindEnvironment(function(data) { // Throws on dev, sometimes, likely to be when the localhost meteor js monitoring script do funny things with sockets
      var method = JSON.parse(data).method;

      if (method === 'login' || method === 'createUser') {
        Collections.Connections.update({}, {$inc: {usersObserving: -1}});
        Collections.Connections.update({}, {$inc: {usersLoggedIn: 1}});
      } else if (method === 'logout') {
        Collections.Connections.update({}, {$inc: {usersLoggedIn: -1}})
        Collections.Connections.update({}, {$inc: {usersObserving: 1}})
      }
    }, function(e) {
      console.error(e);
    }));

    this._session.socket.on('close', Meteor.bindEnvironment(function() {
      if(userId === null || userId === undefined) {
        Collections.Connections.update({}, {$inc: {usersObserving: -1}});
      } else {
        Collections.Connections.update({}, {$inc: {usersLoggedIn: -1}})
      }
    }, function(e) {
      console.error('close error', e);
    }));
  }
});




