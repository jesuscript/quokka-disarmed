(function(){
  _.extend(Template.betStats,{
    created: function(){
      Session.set("current_stake", 0);
      Session.set("bet", {
        status: "new"
      });
    },
    rendered: function(){
      $("#bet-stats .numeric-input").numeric();
    }
  });

  Template.betStats.helpers({
    activeBet: function(){
      var bet = Meteor.user() && Collections.Bets.findOne({playerId: Meteor.user()._id});

      if(bet){
        return _.extend(bet, {
          rangeSize: bet.rangeMax - bet.rangeMin + 1
        });
      }else{
        return {rangeSize: 0};
      }
      
    } 
  });


})();


