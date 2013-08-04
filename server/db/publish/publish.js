Meteor.publish("activity", function(){
  return Collections.Activity.find({},{sort: {timestamp: -1}, limit: 100});
});

AddressPool = new Meteor.Collection('addressPool'); // server only

// Meteor.publish('allTimeNumbersStats', function(){
//   return Collections.AllTimeNumbersStats.find({});
// });

Meteor.publish('allTimeStats', function(){
  return Collections.AllTimeStats.find({});
});

Meteor.publish('allTimeWinners', function(){
  return Collections.AllTimeWinners.find({}, {sort: {totalWon: -1}, limit: 9, fields: {playerName:1, totalWon: 1}});
});

Meteor.publish('bets', function(){ //only publishes for the current game
  var game = DB.currentGame();
  return game && Collections.Bets.find({gameId: game._id});
});

Meteor.publish("chatMsgs", function(){
  return Collections.ChatMsgs.find({},{sort: {timestamp: -1}, limit: 30});
});

Meteor.publish('connections', function(){
  return Collections.Connections.find({});
});

Meteor.publish('flags', function(){
  return Collections.Flags.find({});
});

Meteor.publish('games', function(){
  return Collections.Games.find({},{sort: {createdAt: -1}, limit: 50}); // even 1080p panels can only display 4x 'previous lucky nums' at a time
});

Meteor.publish('gameResults', function(){ //only publishes for the previous game
  // boy do I wish Mongo had joins
  var currentGame = DB.currentGame();
  if (currentGame) { // don't like doing this but have seen it fail before
    var previousGameId = Collections.Games.findOne({publicSeq: currentGame.publicSeq-1})._id;
    return Collections.GameResults.find(
      {gameId: previousGameId },
      {sort: {won: -1}, limit: 9}
    );
  }
});

Meteor.publish('hotColdStats', function(){
  return Collections.HotColdStats.find({}); 
});

Meteor.publish('news', function(){
  return Collections.News.find({}, {sort: {timestamp: -1}, limit: 10});
});

Meteor.publish('userData', function(){  // userdata is a built-in meteor collection
  return Meteor.users.find({_id: this.userId}, // publishes extra fields beyond the default username, emails and profile fields
                           {fields: { 
                             'balance': 1,
                             'depositAddress': 1
                           }});
});

// the user shouldn't have the right to modify anything within their user profiles without going through our server methods first
Meteor.users.deny({update: function () { return true; }});








