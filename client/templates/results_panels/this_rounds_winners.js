Template.thisRoundsWinners.helpers({
  winners: function(){
    var gameResults = Collections.GameResults.find({won: {$gt: 0}}, {sort: {won: -1}, limit: 9}).fetch();
    if(!gameResults) return [];

    return _.map(gameResults, function(result){
      return {
        amount: intToBtc(result.won),
        playerName: result.playerName
      };
    });

  } 
});
