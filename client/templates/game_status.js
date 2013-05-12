Template.game_status.helpers({
  "numberOfPlayers": function(){
    var gameStats = Collections.GameStats.find().fetch()[0];
    return gameStats && gameStats.numberOfPlayers || 0;
  },
  "totalBank": function(){
    var gameStats = Collections.GameStats.findOne();
    return gameStats && gameStats.totalBank || 0;
  },
  "bet": function(){
    var user = Meteor.user();
    
    if(!user) return {};
    
    var bet = Collections.Bets.find({playerId: Meteor.user()._id}).fetch()[0];

    return bet || {};
  }
});
