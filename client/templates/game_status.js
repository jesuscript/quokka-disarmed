Template.game_status.helpers({
  "numberOfPlayers": function(){
    var gameStats = collections.GameStats.find().fetch()[0];
    return gameStats && gameStats.numberOfPlayers;
  },
  "totalBank": function(){
    var gameStats = collections.GameStats.findOne();
    return gameStats && gameStats.totalBank;
  }
});
