Template.allTimeWinners.helpers({
  winners: function(){
    var allTimeWinners = Collections.AllTimeWinners.find({}, {sort: {totalWon: -1}, limit: 9}).fetch();
    if (!allTimeWinners) return [];
    
    return _.map(allTimeWinners, function(winner){
      return {
        totalWon: intToBtc(winner.totalWon),
        playerName: winner.playerName
      };
    });
  } 
});
