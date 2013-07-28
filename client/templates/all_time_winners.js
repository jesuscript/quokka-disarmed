Template.allTimeWinners.helpers({
  winners: function(){
    var allTimeWinners = Collections.AllTimeWinners.find({}).fetch();
    if (!allTimeWinners) return [];

    return _.map(allTimeWinners, function(winner){
      return {
        totalReceived: intToBtc(winner.totalReceived).toFixed(8),
        playerName: winner.playerName
      };
    });
  } 
});
