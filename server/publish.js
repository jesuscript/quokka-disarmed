console.log("publish");
AddressPool = new Meteor.Collection("addressPool"); // server only

Meteor.publish("flags", function(){
  return Collections.Flags.find({});
});

Meteor.publish("gameStats", function(){
  var self = this;
  
  self.added("gameStats", 0);

  var betUpdateCallback = function(){
    var currentGame = Collections.Games.findOne({completed: false});
    var bets = Collections.Bets.find({gameId: currentGame._id}).fetch();
    var totalBank = _.reduce(bets, function(memo, bet){ return memo + bet.amount; }, 0);
    var numberOfPlayers = _.size(_.groupBy(bets, function(bet){ return bet.playerId; }));

    console.log( { numberOfPlayers: numberOfPlayers, totalBank: totalBank});
    self.changed("gameStats", 0, { numberOfPlayers: numberOfPlayers, totalBank: totalBank});
  }

  GameObserver.addBetUpdateCallback(betUpdateCallback.bind(this));

  betUpdateCallback();
  
  //this.ready();
});

Meteor.publish("games", function(){
  return Collections.Games.find({},{sort: {timestamp: -1}, limit: 100});
});

Meteor.publish("userBets", function(){
  return Collections.Bets.find({playerId: this.userId});
});

Meteor.publish("userData", function(){  // built-in meteor collection
  return Meteor.users.find({_id: this.userId},
                           {fields: {
                             'balance': 1,
                             'anonymous': 1,
                             'token': 1,
                             'depositAddress': 1
                           }});
});

// the user shouldn't have the right to modify anything within their user profiles
Meteor.users.deny({update: function () { return true; }});
