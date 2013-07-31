Template.allTimeWinners.helpers({
  winners: function(){
    var allTimeWinners = Collections.AllTimeWinners.find({}).fetch();
    if (!allTimeWinners) return [];

    return _.map(allTimeWinners, function(winner){
      return {
        totalWon: intToBtc(winner.totalWon).toFixed(8),
        playerName: winner.playerName
      };
    });
  } 
});
