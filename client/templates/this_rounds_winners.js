Template.allTimeWinners.helpers({
  winners: function(){
    var lastGame = Collections.Games.findOne({completed: true}, {sort: {completedAt: -1}});
    
    if(!lastGame) return [];
    
    var payouts = Collections.Payouts.find({gameId: lastGame._id}, {sort: {payout: -1}, limit: 10})
          .fetch();

    if(!payouts) return [];

    return _.map(payouts, function(payout){
      var user = Meteor.users.findOne({_id: payout.playerId});

      return {
        amount: intToBtc(payout.payout),
        username: user ? user.username : ""
      };
    });
  } 
});
