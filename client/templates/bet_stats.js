(function(){
  _.extend(Template.betStats,{
    created: function(){
      Session.set("bet", {
        status: "new"
      });
    }
  });

  Template.betStats.helpers({
    playing: function(){
      return !!(Meteor.user() && Collections.Bets.findOne({playerId: Meteor.user()._id}));
    },
    activeBet: function(){
      var bet = Meteor.user() && Collections.Bets.findOne({playerId: Meteor.user()._id});
      var currentGame = Collections.Games.findOne({completed: false});
      var allBets = Collections.Bets.find({gameId: currentGame._id}).fetch();
      var betAggregates = (new Quokka(allBets)).getBetStats(Meteor.user()._id); 

      if(bet){
        if(allBets.length > 1) {
          _.extend(bet,{
            maxToWin: intToBtc(betAggregates.maxToWin),
            maxToLose: intToBtc(betAggregates.maxToLose),
            chanceToWin: betAggregates.chanceToWin
          });
        }
        return _.extend(bet, {
          rangeSize: bet.rangeMax - bet.rangeMin + 1
        });
      }else{
        return {rangeSize: 0};
      }
    }
  });


})();


