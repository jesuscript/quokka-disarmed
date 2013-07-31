Template.thisRoundsWinners.helpers({
  winners: function(){
    var lastGame = Collections.Games.findOne({completed: true}, {sort: {completedAt: -1}});

    var results = Collections.GameResults.find({gameId: lastGame._id},
                                               {sort: {payout: -1}, limit: 10}).fetch();

    console.log(results);
    if(!results) return [];

    return _.map(results, function(r){
      return {
        amount: intToBtc(r.payout-r.stake).toFixed(8),
        playerName: r.playerName
      };
    });

  } 
});
