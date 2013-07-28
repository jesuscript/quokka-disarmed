Template.thisRoundsWinners.helpers({
  winners: function(){

    var lastGame = Collections.Games.findOne({completed: true}, {sort: {completedAt: -1}});
    return [];

    var payouts = Collections.Payouts.find({gameId: lastGame._id}, {sort: {payout: -1}, limit: 10}).fetch();
    if(!payouts) return [];

    return _.map(payouts, function(payout){
      return {
        amount: intToBtc(payout.payout).toFixed(8),
        playerName: payout.playerName
      };
    });

  } 
});
